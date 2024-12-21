// farmerController.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadOnCloudinary } = require('../config/cloudinary.config');
const { setupConnection } = require('../config/database.config');
require('dotenv').config();


async function getFarmerId() {
    try {
        const db = await setupConnection(); // Ensure you have a connection

        const query = 'SELECT count FROM counters WHERE name = ?';
        const [result] = await db.execute(query, ['farmnum']); // Pass 'farmnum' as a string

        if (result.length === 0) {
            throw new Error('Counter not found');
        }

        let num = result[0].count; // Assuming the column is 'count'
        num++;
        await db.execute('UPDATE counters SET count = ? WHERE name = ?', [num, 'farmnum']);
        return `SUPP${num}`;
    } catch (error) {
        console.log("An error occured in generating the farm_id", error.message);
        throw new Error(error.message);
    }
}

async function getproductnum() {
    try {
        const db = await setupConnection(); // Ensure you have a connection

        const query = 'SELECT count FROM counters WHERE name = ?';
        const [result] = await db.execute(query, ['prodnum']); // Pass 'farmnum' as a string

        if (result.length === 0) {
            throw new Error('Counter not found');
        }

        let num = result[0].count; // Assuming the column is 'count'
        num++;
        await db.execute('UPDATE counters SET count = ? WHERE name = ?', [num, 'prodnum']);
        return `PROD${num}`;
    } catch (error) {
        console.log("An error occured in generating prodnum", error.message);
    }
}

async function getCategoryId(name) {
    try {
        const db = await setupConnection(); // Establish the database connection
        const query = 'SELECT * FROM Category WHERE category_id = ?';
        const [rows] = await db.execute(query, [name]);
        console.log(rows[0].category_id);
        return rows[0].category_id;
    } catch (error) {
        console.log("An error occurred while fetching the category ID:", error.message);
    }
}


exports.createFarmer = async (req, res) => {
    try {
        const { first_name, last_name, email, pass, phone } = req.body;
        const imagePath = req.file;
        const phonenum = phone;
        console.log("first_name", first_name);
        console.log("last_name", last_name);
        console.log("email", email);
        console.log("pass", pass);
        console.log("phonenum", phonenum);
        const password = pass;
        // Check if all required fields are provided
        if (!first_name || !last_name || !email || !password || !phonenum) {
            return res.status(400).json({
                message: "The Farmer credentials are required",
            });
        }

        if (!imagePath) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required",
            });
        }

        // Generate a new farmer ID
        const farmerId = await getFarmerId();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload the image to Cloudinary
        const imageUrl = await uploadOnCloudinary(imagePath.path);

        // Insert the farmer details into the database
        const query = `
      INSERT INTO suppliers (id, phonenum, first_name, last_name, email, password, profileImage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const db = await setupConnection();
        const [result] = await db.execute(query, [
            farmerId,
            phonenum,
            first_name,
            last_name,
            email,
            hashedPassword,
            imageUrl,
        ]);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Failed to create farmer",
            });
        }

        res.status(201).json({
            message: "Farmer created successfully",
            farmerId,
            farmer: {
                id: farmerId,
                first_name,
                last_name,
                email,
                phonenum,
                profileImage: imageUrl,
            },
        });
    } catch (error) {
        return res.status(400).json({
            message: "An error occurred while creating the farmer and uploading the image",
            error: error.message,
        });
    }
};



exports.loginFarmer = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("The data in login");
        // Check for missing credentials
        if (!email || !password) {
            return res.status(400).json({
                message: "An error occurred in fetching login credentials",
                success: false
            });
        }

        // Correct SQL query syntax
        const query = 'SELECT * FROM suppliers WHERE email = ?';
        const db = await setupConnection();
        const [result] = await db.execute(query, [email]);

        // Check if the farmer exists
        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Farmer does not exist"
            });
        }

        // Check the password
        const checkPassword = await bcrypt.compare(password, result[0].password);
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect"
            });
        }

        // Generate a token
        const token = jwt.sign({ id: result[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Set the token in a cookie
        const options = { httpOnly: true }; // Ensure the cookie is HTTP-only
        res.cookie("token", token, options);

        // Send a successful response
        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "An error occurred while logging in the farmer",
            error: error.message
        });
    }
}

exports.AddressforFarmer = async (req, res) => {
    try {
        // Extract the farmer ID from the authenticated user's request
        const farmerId = req.Farmer.id;

        // Extract address details from the request body
        const { street, city, state, postal_code, country } = req.body;
        console.log("address", street);
        console.log("address", city);
        console.log("address", state);
        console.log("address", postal_code);
        console.log("address", country);

        // Validate that all required fields are present and not empty
        if (!street || !city || !state || !postal_code || !country) {
            return res.status(400).json({
                success: false,
                message: "All address fields are required and cannot be empty"
            });
        }

        // Generate a unique address ID
        const address_id = `ADDR${Date.now()}`;

        // SQL query to insert the address into the Address table
        const query = 'INSERT INTO Address (address_id,farmer_id , street, state, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const db = await setupConnection();

        // Execute the insert query
        const [result] = await db.execute(query, [address_id, farmerId, street, state, city, postal_code, country]);
        console.log("address update ", result[0]);
        // Check if the address was inserted successfully
        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "An error occurred in adding the address"
            });
        }

        // SQL query to update the supplier's address_id
        const query2 = 'UPDATE suppliers SET address_id = ? WHERE id = ?'; // Corrected table name
        const [result2] = await db.execute(query2, [address_id, farmerId]);

        // Check if the update was successful
        if (result2.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "An error occurred while updating the farmer's address"
            });
        }

        // Respond with success message
        return res.status(201).json({
            success: true,
            message: "Address added successfully"
        });

    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(400).json({
            success: false,
            message: "An error occurred while updating the farmer's address",
            error: error.message
        });
    }
}


exports.getFarmer = async (req, res) => {
    const farmerId = req.Farmer;

    try {
        // SQL query to get farmer details and address
        console.log("farmer", farmerId);
        const query = `
        SELECT s.id, s.first_name, s.last_name , s.email, s.phonenum,s.profileImage , a.street, a.city, a.state, a.postal_code , a.country
        FROM suppliers s
        LEFT JOIN Address a ON s.id = a.farmer_id
        WHERE s.id = ?;
      `;
        const db = await setupConnection();
        // Execute the query
        console.log(farmerId.id);
        const [rows] = await db.execute(query, [farmerId.id]);

        // Check if the farmer exists
        if (rows.length === 0) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        // Send the farmer data as a response
        res.status(200).json({ farmer: rows[0] });
    } catch (error) {
        // Handle errors
        console.error("Error fetching farmer details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.getallproduct = async (req, res) => {
    try {
        const query = `
        SELECT 
            name,
            MAX(price) AS latest_price,  -- Get the latest price for each product name
            GROUP_CONCAT(product_id) AS product_ids,  -- Combine product_ids as a comma-separated string
            SUM(stock) AS total_stock,  -- Sum the stock for each product name
            MAX(description) AS description,  -- Pick one description (could be the latest or any)
            MAX(category_id) AS category_id,  -- Use the category of any product in the group
            MAX(prodImage) AS prodImage  -- Use the image of any product in the group
        FROM Product
        GROUP BY name  -- Only group by name to combine all products with the same name
        ORDER BY name;
    `;
    
        const db = await setupConnection();
        const [result] = await db.execute(query);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        // Transform data into the desired structure
        const groupedProducts = result.map(product => ({
            name: product.name,
            stock: product.total_stock,
            price: product.latest_price,  // Latest price from the query
            description: product.description,
            category_id: product.category_id,
            prodImage: product.prodImage,
            product_ids: product.product_ids.split(','), // Split comma-separated product_ids into an array
        }));

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: groupedProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching products",
            error: error.message
        });
    }
};





exports.getFarmerhistory = async (req, res) => {
    try {
        const farmer = req.Farmer;
        console.log(farmer);
        const query = 'SELECT * FROM inventory WHERE supplier_id = ?';
        const db = await setupConnection();
        const result = await db.execute(query, [farmer.id]);
        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message: "the farmer doesn't exist"
            });
        }
        return res.status(200).json({
            success: true,
            message: "The data is fetched",
            data: result[0]
        });


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "An error occured in getting farmer info",
            error: error.message
        });
    }
}


exports.addproducts = async (req, res) => {
    try {
        const { name, categoryname, price, quantity, description } = req.body;
        const farmer_id = req.Farmer.id; // Assuming `req.Farmer` contains the authenticated farmer's ID
        const imagePath = req.file; // Assuming you're using multer for handling file uploads

        // Validate inputs
        if (!(name && categoryname && price && quantity && description && imagePath)) {
            return res.status(400).json({
                success: false,
                message: "All fields including the product image are required.",
            });
        }

        // Upload the product image to Cloudinary
        const imageUrl = await uploadOnCloudinary(imagePath.path); // Upload the image and get the URL

        // Get the current date and time
        const currentDate = new Date();
        const date_added = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const time_added = currentDate.toTimeString().split(' ')[0]; // Format: HH:MM:SS

        // Setup the database connection
        const db = await setupConnection();

        // Check if the product already exists for the same farmer and category
        const [existingProduct] = await db.query(
            `SELECT * FROM farmproducts WHERE farmer_id = ? AND product_name = ? AND category_id = ?`,
            [farmer_id, name, categoryname]
        );

        if (existingProduct.length > 0) {
            // Product exists, update it
            const product = existingProduct[0];
            const updatedQuantity = parseFloat(product.quantity) + parseFloat(quantity); // Add to existing quantity
            console.log("quantity",updatedQuantity);
            console.log("quantity",product.quantity);
            console.log("quantity",parseInt(quantity));
            const updatedPrice = price; // You can also modify the price if needed

            // Update farmproducts table
            const updateProductResult = await db.query(
                `UPDATE farmproducts 
                SET quantity = ?, price = ?, image = ?, date_added = ?, time_added = ? 
                WHERE product_name = ? AND farmer_id = ?`,
                [updatedQuantity, updatedPrice, imageUrl, date_added, time_added, name, farmer_id]
            );

            // Log the update result
            console.log("Updated farmproducts:", updateProductResult);

            // Update the corresponding record in Allfarmproducts table
            const total = updatedQuantity * updatedPrice; // Calculate the total value
            const updateAllFarmProductsResult = await db.query(
                `UPDATE Allfarmproducts 
                SET total = ?, time = ?, date = ? 
                WHERE farmProducts_id = ?`,
                [total, time_added, date_added, product.id]
            );

            // Log the Allfarmproducts update result
            console.log("Updated Allfarmproducts:", updateAllFarmProductsResult);

            return res.status(200).json({
                success: true,
                message: "Product updated successfully.",
                product_id: product.id, // Return the product ID for reference
            });
        } else {
            // Product does not exist, insert a new one
            const [farmProductResult] = await db.query(
                `INSERT INTO farmproducts 
                (farmer_id, product_name, category_id, quantity, price, image, status, date_added, time_added) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [farmer_id, name, categoryname, quantity, price, imageUrl, 'Pending', date_added, time_added]
            );

            const farmProducts_id = farmProductResult.insertId; // Get the ID of the inserted product

            // Calculate total price for the product (quantity * price)
            const total = quantity * price;

            // Insert data into the Allfarmproducts table
            const insertAllFarmProductsResult = await db.query(
                `INSERT INTO Allfarmproducts 
                (farmer_id, farmProducts_id, total, time, date, status) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [farmer_id, farmProducts_id, total, time_added, date_added, 'Pending']
            );

            // Log the insertion result into Allfarmproducts
            console.log("Inserted into Allfarmproducts:", insertAllFarmProductsResult);

            return res.status(201).json({
                success: true,
                message: "Product added successfully and is pending admin approval.",
                product_id: farmProducts_id, // Return the product ID for reference
            });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the product.",
            error: error.message,
        });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const farmer = req.Farmer; // Assuming you have the farmer data from authentication middleware
        const { product_id, name, description, price, quantity , category_id , prodImage } = req.body;
        const stock = quantity;
        const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Check if product_id is provided
        console.log("Product ID:", product_id);
        console.log("Name:", name);
        console.log("Description:", description);
        console.log("Price:", price);
        console.log("Stock:", stock);
        console.log("Category ID:", category_id);
        console.log("Created At:", created_at);
        console.log("Product Image URL:", prodImage);
        

        // Check if any of the required fields are missing
        if (!product_id || !name || !description || !price || !stock || !category_id || !created_at || !prodImage) {
            return res.status(400).json({
                success: false,
                message: "All fields are required. Please provide complete product details."
            });
        }

        // Establish a connection to the database
        const db = await setupConnection();

        // Construct the SQL query to update the product
        const updateProductQuery = `
        UPDATE Product
        SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          stock = COALESCE(?, stock),
          category_id = COALESCE(?, category_id),
          created_at = COALESCE(?, created_at),
          prodImage = COALESCE(?, prodImage)
        WHERE product_id = ?;
      `;

        // Construct the SQL query to update the inventory
        const updateInventoryQuery = `
        UPDATE Inventory
        SET
          quantity = COALESCE(?, quantity),
          price = COALESCE(?, price),
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          category_id = COALESCE(?, category_id),
          prodImage = COALESCE(?, prodImage)
        WHERE product_id = ? AND supplier_id = ?;
      `;

        // Parameters for the Product table update
        const productParams = [
            name,
            description,
            price,
            stock,
            category_id,
            created_at,
            prodImage,
            product_id
        ];

        // Parameters for the Inventory table update
        const inventoryParams = [
            stock,
            price,
            name,
            description,
            category_id,
            prodImage,
            product_id,
            farmer.id // Assuming farmer has an id property
        ];

        // Execute both queries using Promise.all for parallel execution
        const [productResult, inventoryResult] = await Promise.all([
            db.execute(updateProductQuery, productParams),
            db.execute(updateInventoryQuery, inventoryParams)
        ]);

        // Check if any rows were affected
        if (productResult[0].affectedRows === 0 && inventoryResult[0].affectedRows === 0) {
            return res.status(404).json({ message: "Product not found or no changes made" });
        }

        // Send a success response
        res.status(200).json({ message: "Product and inventory updated successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const farmer = req.Farmer; // Assuming the farmer details are available in the request
        const { product_id } = req.params;
        
        console.log('Farmer:', farmer); // Check farmer details
        console.log('Product ID:', product_id); // Check product ID
        
        const connection = await setupConnection(); // Ensure connection setup is working

        await connection.beginTransaction();
        console.log("Transaction started");

        try {
            const [productCheck] = await connection.execute(
                'SELECT * FROM Product WHERE product_id = ?',
                [product_id]
            );

            console.log("Product check result:", productCheck);
            
            if (productCheck.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: "Product not found or you are not authorized to delete this product." });
            }

            await connection.query('DELETE FROM inventory WHERE product_id = ?', [product_id]);
            await connection.query('DELETE FROM Product WHERE product_id = ?', [product_id]);

            await connection.commit();
            res.status(200).json({ message: "Product and inventory entry deleted successfully." });
        } catch (error) {
            await connection.rollback();
            console.error("Error in deletion:", error);
            res.status(500).json({ message: "An error occurred while deleting the product." });
        } finally {
            connection.end(); // Close the connection for single connection setup
        }
    } catch (error) {
        console.error("Error setting up connection:", error);
        res.status(500).json({ message: "Error occurred during product deletion." });
    }
};
