import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css"; // Import the CSS file

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false); // To track if a user is being deleted
    const [successMessage, setSuccessMessage] = useState(""); // To display success message after deletion

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:4000/adminpanel/api/v2/allUsers");
                setUsers(response.data.users);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch users");
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (customerId) => {
        setDeleting(true);
        try {
            // Call the delete API to remove the user
            await axios.delete(`http://localhost:4000/adminpanel/api/v2/delUsers/${customerId}`);
            // Remove the deleted user from the UI
            setUsers(users.filter((user) => user.customer_id !== customerId));
            setSuccessMessage("User deleted successfully!");
        } catch (err) {
            setError("Failed to delete user");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="all-users-container">
            <h1 className="title">Users (Sorted by Orders)</h1>
            {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
            <div className="user-cards">
                {users.map((user) => (
                    <div key={user.customer_id} className="user-card">
                        <img
                            src={user.profile_image || "/default-profile.png"}
                            alt={`${user.first_name} ${user.last_name}'s profile`}
                            className="profile-image"
                        />
                        <h2 className="user-name">{user.first_name} {user.last_name}</h2>
                        <p className="user-email">{user.email}</p>
                        <p className="user-orders">Total Orders: {user.total_orders}</p>
                        <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(user.customer_id)}
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

export default AllUsers;
