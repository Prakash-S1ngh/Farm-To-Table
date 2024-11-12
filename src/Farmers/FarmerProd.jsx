import { useEffect, useState } from "react";
import './FarmerProd.css';
import axios from "axios";

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:4000/farmers/api/v2/gethistory', {
            withCredentials: true,
        });
        return response.data.data; 
    } catch (error) {
        console.log("An error occurred while fetching details:", error.message);
        return [];
    }
}

const updateProduct = async (product) => {
    try {
        const updatedProduct = {
            ...product,
            name: prompt("Enter new name:", product.name) || product.name,
            description: prompt("Enter new description:", product.description) || product.description,
            price: parseFloat(prompt("Enter new price:", product.price)) || product.price,
            quantity: parseInt(prompt("Enter new quantity:", product.quantity)) || product.quantity
        };
        
        await axios.put(`http://localhost:4000/farmers/api/v2/updateproduct`, updatedProduct, {
            withCredentials: true,
        });
        alert("Product updated successfully!");
    } catch (error) {
        console.error("Error updating product:", error.message);
        alert("An error occurred while updating the product.");
    }
}

const FarmerProd = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData();
            setData(fetchedData);
        };
        getData();
    }, []);

    return (
        <div className="settings-container">
            <aside className="sidebar">
                <ul>
                    <li><a href="/UserProfile"><span className="nav-icon">📊</span> Dashboard</a></li>
                    <li><a href="#"><span className="nav-icon">📜</span> Farm Orders</a></li>
                    <li>Log-out</li>
                </ul>
            </aside>
            <main className="main-content">
                <h1>Farmer Account Settings</h1>
                <div className="product-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Date Supplied</th>
                                <th>Price</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.product_id}</td>
                                        <td>{product.category_id}</td>
                                        <td>{product.quantity}KG</td>
                                        <td>{new Date(product.date_supplied).toLocaleDateString()}</td>
                                        <td>₹{product.price}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>
                                            <img
                                                src={product.prodImage}
                                                alt={product.name}
                                                className="prod-image"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="update-button"
                                                onClick={() => updateProduct(product)}
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No products available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default FarmerProd;
