import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [categoryname, setCategoryname] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('categoryname', categoryname);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('describption', description);
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:4000/farmers/api/v2/addProducts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h1>Add New Product</h1>
            <form onSubmit={handleSubmit} className="product-form">
                {loading && <div className="loading-spinner">Loading...</div>}
                {message && <div className="message">{message}</div>}
                
                <label htmlFor="name">Product Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="categoryname">Category Name:</label>
                <select
                    id="categoryname"
                    value={categoryname}
                    onChange={(e) => setCategoryname(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a category</option>
                    <option value="CAT5">Dairy</option>
                    <option value="CAT1">Fruits</option>
                    <option value="CAT6">Other</option>
                    <option value="CAT4">Special</option>
                    <option value="CAT3">Spices</option>
                    <option value="CAT2">Vegetables</option>
                </select>

                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    placeholder='per kg'
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    placeholder='in kg'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>

                <label htmlFor="image">Product Image:</label>
                <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                />
                
                <button type="submit" className="submit-button">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
