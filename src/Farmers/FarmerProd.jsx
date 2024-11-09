import { useEffect, useState } from "react";
import './FarmerProd.css';
import axios from "axios";

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:4000/farmers/api/v2/gethistory', {
            withCredentials: true,
        });
        console.log(typeof(response.data.data));
        console.log(response.data.data); // Checking the data format
        return response.data.data;  // Return the actual data (array of products)
    } catch (error) {
        console.log("An error occurred while fetching details:", error.message);
        return [];  // Return an empty array in case of error
    }
}

const FarmerProd = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData();
            setData(fetchedData);  // Set the fetched data correctly
        };
        getData();
    }, []);

    return (
        <div className="settings-container">
            <aside className="sidebar">
                <ul>
                    <li><a href="/UserProfile"><span className="nav-icon">📊</span> Dashboard</a></li>
                    <li><a href="#"> <span className="nav-icon">📜</span>Farm Orders</a></li>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No products available</td>
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
