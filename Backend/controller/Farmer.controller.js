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
        console.log("imagePath", imagePath);
        console.log("image",req.files);
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

exports.updateFarmerprofile = async (req, res) => {
    try {
        const farmerId = req.Farmer.id;
        const { firstName, lastName, email, phone, street, city, state, postalCode, country } = req.body;

        // Log each field and its value
        console.log("first_name:", firstName);
        console.log("last_name:", lastName);
        console.log("email:", email);
        console.log("phonenum:", phone );
        console.log("street:", street);
        console.log("city:", city);
        console.log("state:", state);
        console.log("postal_code:", postalCode);
        console.log("country:", country);

        // Check if any required fields are missing
        if (!firstName || !lastName || !email || !phone || !street || !city || !state || !postalCode || !country) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const db = await setupConnection();

        // STEP 1: Get existing address_id (if any) for this farmer
        const [existingRows] = await db.execute(
            'SELECT address_id FROM suppliers WHERE id = ?',
            [farmerId]
        );
        const existingAddressId = existingRows.length > 0 ? existingRows[0].address_id : null;
        console.log("Existing address_id:", existingAddressId);
        let address_id;

        if (existingAddressId) {
            // STEP 2: Update existing address
            console.log("Updating existing address:", existingAddressId);
            const updateQuery = `
                UPDATE Address 
                SET street = ?, state = ?, city = ?, postal_code = ?, country = ?
                WHERE address_id = ?
            `;
            const [updateResult] = await db.execute(updateQuery, [street, state, city, postalCode, country, existingAddressId]);
            
            if (updateResult.affectedRows === 0) {
                return res.status(400).json({
                    success: false,
                    message: "An error occurred while updating the address."
                });
            }
            address_id = existingAddressId;

        } else {
            // STEP 3: Create new address
            address_id = `ADDR${Date.now()}`;
            const insertQuery = `
                INSERT INTO Address (address_id, farmer_id, street, state, city, postal_code, country) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [insertResult] = await db.execute(insertQuery, [address_id, farmerId, street, state, city, postalCode, country]);
            
            if (insertResult.affectedRows === 0) {
                return res.status(400).json({
                    success: false,
                    message: "An error occurred while creating the address."
                });
            }
        }

        // STEP 4: Update farmer profile
        const farmerQuery = `
            UPDATE suppliers 
            SET first_name = ?, last_name = ?, email = ?, phonenum = ?, address_id = ? 
            WHERE id = ?`;
        const [userResult] = await db.execute(farmerQuery, [firstName, lastName, email, phone, address_id, farmerId]);

        if (userResult.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "An error occurred while updating the farmer's profile."
            });
        }

        // STEP 5: Done
        return res.status(200).json({
            success: true,
            message: "Farmer profile updated successfully",
            farmer: {
                id: farmerId,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the farmer's profile",
            error: error.message
        });
    }
};

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
                p.name,
                p.price,
                p.description,
                p.category_id,
                p.prodImage,
                p.product_id,
                i.quantity,
                i.supplier_id,
                CONCAT(s.first_name, ' ', s.last_name) AS supplier_name
            FROM Product p
            INNER JOIN inventory i ON p.product_id = i.product_id
            INNER JOIN suppliers s ON i.supplier_id = s.id
            ORDER BY p.name;
        `;
        const db = await setupConnection();
        const [rows] = await db.execute(query);

        if (!rows.length) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        // Group by product name
        const groupedProducts = {};
        rows.forEach(row => {
            if (!groupedProducts[row.name]) {
                groupedProducts[row.name] = {
                    name: row.name,
                    price: Number(row.price),
                    description: row.description,
                    category_id: row.category_id,
                    prodImage: row.prodImage,
                    stock: 0,
                    product_ids: []
                };
            }

            groupedProducts[row.name].stock += row.quantity;

            groupedProducts[row.name].product_ids.push({
                product_id: row.product_id,
                quantity: row.quantity,
                supplier_id: row.supplier_id,
                supplier_name: row.supplier_name
            });
        });

        const result = Object.values(groupedProducts);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: result
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

exports.getPendingProducts = async (req, res) => {
    try {
        const farmerId = req.Farmer.id;
        const db = await setupConnection();
        const query = 'SELECT * FROM farmproducts WHERE farmer_id = ?'
        const [result] = await db.execute(query, [farmerId]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending products found for this farmer."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Pending products fetched successfully.",
            products: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching pending products.",
            error: error.message
        });
    }
}


exports.updateProduct = async (req, res) => {
  try {
    const farmer = req.Farmer; // farmer from auth middleware
    const {
      farmProducts_id,
      product_name,
      category_id,
      quantity,
      price,
      status,
      image = null,
      description = null,
    } = req.body.product;
    console.log("The data in update product", req.body.product);

    // Validate required fields
    if (
      !farmProducts_id ||
      !product_name ||
      !category_id ||
      !quantity ||
      !price ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const db = await setupConnection();

    // Current date and time for date_added and time_added fields
    const now = new Date();
    const date_added = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const time_added = now.toTimeString().slice(0, 8); // HH:mm:ss

    const updateQuery = `
      UPDATE farmProducts
      SET
        product_name = ?,
        category_id = ?,
        quantity = ?,
        price = ?,
        image = COALESCE(?, image),
        status = ?,
        date_added = ?,
        time_added = ?,
        description = COALESCE(?, description)
      WHERE farmProducts_id = ? AND farmer_id = ? AND status = 'Pending';
    `;

    const params = [
      product_name,
      category_id,
      quantity,
      price,
      image,
      status,
      date_added,
      time_added,
      description,
      farmProducts_id,
      farmer.id,
    ];

    const [results] = await db.execute(updateQuery, params);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or cannot be updated (maybe already approved).",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Error updating farmProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const farmer = req.Farmer; // Farmer data from auth middleware
    const { product_id } = req.params;
    const farmProducts_id  = product_id;
    console.log(req.params);

    console.log('Farmer ID:', farmer.id);
    console.log('Farm Product ID:', farmProducts_id);

    const connection = await setupConnection();
    await connection.beginTransaction();

    try {
      // ✅ Check if the farm product exists and belongs to this farmer
      const [productCheck] = await connection.execute(
        'SELECT * FROM farmProducts WHERE farmProducts_id = ? AND farmer_id = ?',
        [farmProducts_id, farmer.id]
      );

      if (productCheck.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Product not found or you are not authorized to delete this product." });
      }

      // ✅ Delete the record
      await connection.execute('DELETE FROM farmProducts WHERE farmProducts_id = ? AND farmer_id = ?', [
        farmProducts_id,
        farmer.id
      ]);

      await connection.commit();
      res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
      await connection.rollback();
      console.error("Error in deletion:", error);
      res.status(500).json({ message: "An error occurred while deleting the product." });
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error("Error setting up connection:", error);
    res.status(500).json({ message: "Error occurred during product deletion." });
  }
};
