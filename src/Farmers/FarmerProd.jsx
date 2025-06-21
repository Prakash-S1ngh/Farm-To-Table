import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";



const deleteProduct = async (product_id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`http://localhost:4000/farmers/api/v2/deleteProduct/${product_id}`, {
      withCredentials: true,
    });
    if (res.status === 200) {
      alert("Product deleted successfully.");
      window.location.reload();
    }
  } catch (error) {
    console.error("Error deleting product:", error.message);
    alert(error.response?.data?.message || "An error occurred while deleting the product.");
  }
};

const FarmerProd = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingItems, setPendingItems] = useState([]);
  const [acceptedItems, setAcceptedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const updateProduct = async (product) => {
  try {
    console.log("Updating product:", product);
    const res = await axios.put(
      "http://localhost:4000/farmers/api/v2/updateProduct",
      {
        product
      },
      { withCredentials: true }
    );
    alert("Product updated successfully!");
    console.log(res.data);
  } catch (error) {
    console.error("Error updating product:", error.message);
    alert(error.response?.data?.message || "An error occurred while updating the product.");
  }
};

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:4000/farmers/api/v2/getpending", {
        withCredentials: true,
      });
      const allProducts = response.data.products || [];
      setPendingItems(allProducts.filter((product) => product.status === "Pending"));
      setAcceptedItems(allProducts.filter((product) => product.status === "accepted"));
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const dataToDisplay = activeTab === "pending" ? pendingItems : acceptedItems;

  const handleEditClick = (product) => {
    setEditingProductId(product.farmProducts_id);
    console.log(product);
    setEditValues({
      category_id: product.category_id,
      quantity: product.quantity,
      price: product.price,
      product_name: product.product_name,
    });
  };
  
  const handleSave = (product) => {
    updateProduct({ ...product, ...editValues });
    setEditingProductId(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white rounded-r-2xl shadow-2xl p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Navigation</h2>
        </div>
        <ul className="space-y-3">
          <li><Link to="/" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">🏠 Home</Link></li>
          <li><Link to="/" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">📊 Dashboard</Link></li>
          <li><Link to="/" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">📦 Farm Orders</Link></li>
          <li><Link to="/" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">📋 Queued Items</Link></li>
          <li><Link to="/" className="flex items-center p-3 text-red-600 rounded-xl hover:bg-red-100">🚪 Log-out</Link></li>
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Farmer Account Settings</h1>
            <button
              onClick={fetchProducts}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-4 py-2 hover:scale-105 transition-transform"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex space-x-4 mt-4">
            <button
              className={`px-6 py-3 rounded-full font-bold text-white transition-transform ${activeTab === "pending" ? "bg-gradient-to-r from-yellow-500 to-orange-500 scale-105" : "bg-gray-300 text-gray-600"}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Orders
            </button>
            <button
              className={`px-6 py-3 rounded-full font-bold text-white transition-transform ${activeTab === "accepted" ? "bg-gradient-to-r from-green-500 to-teal-500 scale-105" : "bg-gray-300 text-gray-600"}`}
              onClick={() => setActiveTab("accepted")}
            >
              Accepted Orders
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="w-8 h-8 border-4 border-t-4 rounded-full border-t-blue-500 animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-xl mt-4">{error}</div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mt-4">
              <div className="px-6 py-4 bg-gray-100 border-b">
                <h2 className="text-2xl font-semibold text-gray-800">{activeTab === "pending" ? "Pending Products" : "Accepted Products"}</h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-300">
                <table className="w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date Supplied</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Image</th>
                      {activeTab === "pending" && (
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataToDisplay.length > 0 ? (
                      dataToDisplay.map((product) => (
                        <tr key={product.farmProducts_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {editingProductId === product.farmProducts_id ? (
                              <input
                                className="border rounded p-1 w-24"
                                value={editValues.category_id}
                                onChange={(e) => setEditValues({ ...editValues, category_id: e.target.value })}
                              />
                            ) : (
                              <span>{product.category_id}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingProductId === product.farmProducts_id ? (
                              <input
                                className="border rounded p-1 w-24"
                                value={editValues.quantity}
                                onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })}
                              />
                            ) : (
                              <span>{product.quantity} KG</span>
                            )}
                          </td>
                          <td className="px-6 py-4">{new Date(product.date_added).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            {editingProductId === product.farmProducts_id ? (
                              <input
                                className="border rounded p-1 w-24"
                                value={editValues.price}
                                onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                              />
                            ) : (
                              <span>₹{product.price}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingProductId === product.farmProducts_id ? (
                              <input
                                className="border rounded p-1 w-32"
                                value={editValues.product_name}
                                onChange={(e) => setEditValues({ ...editValues, product_name: e.target.value })}
                              />
                            ) : (
                              <span>{product.product_name}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <img
                              src={product.image}
                              alt={product.product_name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                              }}
                            />
                          </td>
                          {activeTab === "pending" && (
                            <td className="px-6 py-4 space-x-2">
                              {editingProductId === product.farmProducts_id ? (
                                <button
                                  onClick={() => handleSave(product)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg px-3 py-1 hover:scale-105"
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEditClick(product)}
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg px-3 py-1 hover:scale-105"
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                onClick={() => deleteProduct(product.farmProducts_id)}
                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg px-3 py-1 hover:scale-105"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={activeTab === "pending" ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                          No products available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmerProd;