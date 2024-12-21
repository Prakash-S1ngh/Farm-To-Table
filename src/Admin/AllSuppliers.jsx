import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Suppliers.css"; // You can reuse the same CSS file or create a new one

const AllSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false); // To track if a supplier is being deleted
    const [successMessage, setSuccessMessage] = useState(""); // To display success message after deletion
    const [view, setView] = useState("items_listed"); // Default view to 'items_listed'

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/adminpanel/api/v2/getAllfarmer?view=${view}`);
                setSuppliers(response.data.suppliers);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch suppliers");
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, [view]); // Fetch suppliers whenever the view changes

    const handleDelete = async (supplierId) => {
        setDeleting(true);
        try {
            // Call the delete API to remove the supplier
            await axios.delete(`http://localhost:4000/adminpanel/api/v2/delSuppliers/${supplierId}`);
            // Remove the deleted supplier from the UI
            setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
            setSuccessMessage("Supplier deleted successfully!");
        } catch (err) {
            setError("Failed to delete supplier");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="all-suppliers-container">
            <h1 className="title">Suppliers (Sorted by Orders)</h1>
            {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
            
            {/* Toggle buttons for "items_listed" and "items_sold" */}
            <div className="view-toggle">
                <button onClick={() => setView("items_listed")} className={view === "items_listed" ? "active" : ""}>
                    Items Listed
                </button>
                <button onClick={() => setView("items_sold")} className={view === "items_sold" ? "active" : ""}>
                    Items Sold
                </button>
            </div>

            <div className="supplier-cards">
                {suppliers.map((supplier) => (
                    <div key={supplier.supplier_id} className="supplier-card">
                        <img
                            src={supplier.profileImage || "/default-profile.png"}
                            alt={`${supplier.first_name} ${supplier.last_name}'s profile`}
                            className="profile-image"
                        />
                        <h2 className="supplier-name">{supplier.first_name} {supplier.last_name}</h2>
                        <p className="supplier-email">{supplier.email}</p>
                        <p className="supplier-phone">Phone: {supplier.phone}</p>
                        <p className="supplier-orders">Total Orders: {supplier.total_orders}</p>

                        {/* Display the different stats based on the view selected */}
                        <p className="supplier-stats">
                            {view === "items_listed"
                                ? `Items Listed: ${supplier.items_listed}`
                                : `Items Sold: ${supplier.items_sold}`}
                        </p>

                        <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(supplier.id)}
                            disabled={deleting} // Disable the delete button while deleting
                        >
                            {deleting ? 'Deleting...' : 'Delete'} {/* Show loading text while deleting */}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllSuppliers;
