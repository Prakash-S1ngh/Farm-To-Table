// farmerController.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadOnCloudinary } = require('../config/cloudinary.config');
const { pool } = require('../config/database.config');
require('dotenv').config();


async function getFarmerId() {
    try {
        const db = pool; // Ensure you have a connection

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

// async function getproductnum() {
//     try {
//         const db = await setupConnection(); // Ensure you have a connection

//         const query = 'SELECT count FROM counters WHERE name = ?';
//         const [result] = await db.execute(query, ['prodnum']); // Pass 'farmnum' as a string

//         if (result.length === 0) {
//             throw new Error('Counter not found');
//         }

//         let num = result[0].count; // Assuming the column is 'count'
//         num++;
//         await db.execute('UPDATE counters SET count = ? WHERE name = ?', [num, 'prodnum']);
//         return `PROD${num}`;
//     } catch (error) {
//         console.log("An error occured in generating prodnum", error.message);
//     }
// }

// async function getCategoryId(name) {
//     try {
//         const db = await setupConnection(); // Establish the database connection
//         const query = 'SELECT * FROM Category WHERE category_id = ?';
//         const [rows] = await db.execute(query, [name]);
//         console.log(rows[0].category_id);
//         return rows[0].category_id;
//     } catch (error) {
//         console.log("An error occurred while fetching the category ID:", error.message);
//     }
// }


exports.createFarmer = async (req, res) => {
    try {
        console.log("Farmer signup request received");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        const { first_name, last_name, email, pass, phone } = req.body;
        const imagePath = req.file;
        const phonenum = phone;
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
        console.log("The farmer id is", farmerId);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload the image to Cloudinary
        console.log("Uploading image to Cloudinary:", imagePath.path);
        const imageUrl = await uploadOnCloudinary(imagePath.path);
        console.log("Image uploaded successfully:", imageUrl);

        // Insert the farmer details into the database
        const query = `
      INSERT INTO suppliers (id, phonenum, first_name, last_name, email, password, profileImage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const db = pool;
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
        console.error("Error in createFarmer:", error);
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
        const db = pool;
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

        // Check if any required fields are missing
        if (!firstName || !lastName || !email || !phone || !street || !city || !state || !postalCode || !country) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const db = pool;

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
        const db = pool;
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
        const db = pool;
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
        const db = pool;
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
        const db = pool;

        // Check if the product already exists for the same farmer and category
        const [existingProduct] = await db.query(
            `SELECT * FROM farmproducts WHERE farmer_id = ? AND product_name = ? AND category_id = ?`,
            [farmer_id, name, categoryname]
        );

        if (existingProduct.length > 0) {
            // Product exists, update it
            const product = existingProduct[0];
            const updatedQuantity = parseFloat(product.quantity) + parseFloat(quantity); // Add to existing quantity
            const updatedPrice = price; // You can also modify the price if needed

            // Update farmproducts table
            const updateProductResult = await db.query(
                `UPDATE farmproducts 
                SET quantity = ?, price = ?, image = ?, date_added = ?, time_added = ?, description = ? 
                WHERE product_name = ? AND farmer_id = ?`,
                [updatedQuantity, updatedPrice, imageUrl, date_added, time_added, description || null, name, farmer_id]
            );

            // Update the corresponding record in Allfarmproducts table
            const total = updatedQuantity * updatedPrice; // Calculate the total value
            const updateAllFarmProductsResult = await db.query(
                `UPDATE Allfarmproducts 
                SET total = ?, time = ?, date = ?, description = ? 
                WHERE farmProducts_id = ?`,
                [total, time_added, date_added, description || null, product.id]
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
                (farmer_id, product_name, category_id, quantity, price, image, status, date_added, time_added, description) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [farmer_id, name, categoryname, quantity, price, imageUrl, 'Pending', date_added, time_added, description || null]
            );

            const farmProducts_id = farmProductResult.insertId; // Get the ID of the inserted product

            // Calculate total price for the product (quantity * price)
            const total = quantity * price;

            // Insert data into the Allfarmproducts table
            const insertAllFarmProductsResult = await db.query(
                `INSERT INTO Allfarmproducts 
                (farmer_id, farmProducts_id, total, time, date, status, description) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [farmer_id, farmProducts_id, total, time_added, date_added, 'Pending', description || null]
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
        const db = pool;
        const query = 'SELECT * FROM farmproducts WHERE farmer_id = ? AND status = "Pending"'
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

exports.getAllProducts = async (req, res) => {
    try {
        const farmerId = req.Farmer.id;
        const db = pool;
        
        // Get query parameters for filtering
        const { status } = req.query;
        
        let query = 'SELECT * FROM farmproducts WHERE farmer_id = ?';
        let params = [farmerId];
        
        // Add status filter if provided
        if (status && status !== 'all') {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY date_added DESC, time_added DESC';
        
        const [result] = await db.execute(query, params);
        
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: status ? `No ${status} products found for this farmer.` : "No products found for this farmer."
            });
        }
        
        // Group products by status for better organization
        const productsByStatus = {
            pending: result.filter(product => product.status === 'Pending'),
            approved: result.filter(product => product.status === 'Approved'),
            rejected: result.filter(product => product.status === 'Rejected')
        };
        
        return res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            totalProducts: result.length,
            products: result,
            productsByStatus
        });
    } catch (error) {
        console.error("Error fetching all products:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching products.",
            error: error.message
        });
    }
}

exports.getProductsByStatus = async (req, res) => {
    try {
        const farmerId = req.Farmer.id;
        const { status } = req.params;
        const db = pool;
        
        // Validate status parameter
        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: Pending, Approved, Rejected"
            });
        }
        
        const query = `
            SELECT fp.*, af.total, af.time, af.date as af_date
            FROM farmproducts fp
            LEFT JOIN Allfarmproducts af ON fp.id = af.farmProducts_id
            WHERE fp.farmer_id = ? AND fp.status = ?
            ORDER BY fp.date_added DESC, fp.time_added DESC
        `;
        
        const [result] = await db.execute(query, [farmerId, status]);
        
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No ${status.toLowerCase()} products found for this farmer.`
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `${status} products fetched successfully.`,
            status: status,
            totalProducts: result.length,
            products: result
        });
    } catch (error) {
        console.error("Error fetching products by status:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching products.",
            error: error.message
        });
    }
}

exports.getProductStats = async (req, res) => {
    try {
        const farmerId = req.Farmer.id;
        const db = pool;
        
        const query = `
            SELECT 
                status,
                COUNT(*) as count,
                SUM(quantity) as total_quantity,
                SUM(quantity * price) as total_value
            FROM farmproducts 
            WHERE farmer_id = ?
            GROUP BY status
        `;
        
        const [result] = await db.execute(query, [farmerId]);
        
        // Calculate totals
        const totalProducts = result.reduce((sum, row) => sum + row.count, 0);
        const totalValue = result.reduce((sum, row) => sum + (row.total_value || 0), 0);
        
        // Organize by status
        const stats = {
            pending: result.find(row => row.status === 'Pending') || { count: 0, total_quantity: 0, total_value: 0 },
            approved: result.find(row => row.status === 'Approved') || { count: 0, total_quantity: 0, total_value: 0 },
            rejected: result.find(row => row.status === 'Rejected') || { count: 0, total_quantity: 0, total_value: 0 },
            total: {
                products: totalProducts,
                value: totalValue
            }
        };
        
        return res.status(200).json({
            success: true,
            message: "Product statistics fetched successfully.",
            stats
        });
    } catch (error) {
        console.error("Error fetching product statistics:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching product statistics.",
            error: error.message
        });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const farmerId = req.Farmer.id;
        const { productId } = req.params;
        const db = pool;
        
        const query = `
            SELECT fp.*, af.total, af.time, af.date as af_date
            FROM farmproducts fp
            LEFT JOIN Allfarmproducts af ON fp.id = af.farmProducts_id
            WHERE fp.id = ? AND fp.farmer_id = ?
        `;
        
        const [result] = await db.execute(query, [productId, farmerId]);
        
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't have permission to view it."
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Product fetched successfully.",
            product: result[0]
        });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the product.",
            error: error.message
        });
    }
}


exports.updateProduct = async (req, res) => {
  try {
    const farmer = req.Farmer; // farmer from auth middleware
    const imageFile = req.file; // Get uploaded image if any
    
    const {
      farmProducts_id,
      product_name,
      category_id,
      quantity,
      price,
      status = 'Pending',
      description = null,
    } = req.body;
    
    console.log("Update product request:", {
      farmProducts_id,
      product_name,
      category_id,
      quantity,
      price,
      status,
      description,
      hasImage: !!imageFile
    });

    // Validate required fields
    if (!farmProducts_id || !product_name || !category_id || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "farmProducts_id, product_name, category_id, quantity, and price are required.",
      });
    }

    const db = pool;

    // Check if product exists and belongs to this farmer
    const [existingProduct] = await db.execute(
      `SELECT * FROM farmproducts WHERE id = ? AND farmer_id = ? AND status = 'Pending'`,
      [farmProducts_id, farmer.id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or cannot be updated (maybe already approved).",
      });
    }

    const currentProduct = existingProduct[0];
    let imageUrl = currentProduct.image; // Keep existing image by default

    // Handle image upload if new image is provided
    if (imageFile) {
      try {
        imageUrl = await uploadOnCloudinary(imageFile.path);
        console.log("New image uploaded:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading image.",
        });
      }
    }

    // Current date and time
    const now = new Date();
    const date_added = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const time_added = now.toTimeString().slice(0, 8); // HH:mm:ss

    // Calculate new total
    const total = quantity * price;

    // Update farmproducts table
    const updateFarmProductQuery = `
      UPDATE farmproducts
      SET
        product_name = ?,
        category_id = ?,
        quantity = ?,
        price = ?,
        image = ?,
        status = ?,
        date_added = ?,
        time_added = ?,
        description = ?
      WHERE id = ? AND farmer_id = ? AND status = 'Pending';
    `;

    const farmProductParams = [
      product_name,
      category_id,
      quantity,
      price,
      imageUrl,
      status,
      date_added,
      time_added,
      description || null,
      farmProducts_id,
      farmer.id,
    ];

    const [farmProductResult] = await db.execute(updateFarmProductQuery, farmProductParams);

    if (farmProductResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Failed to update product.",
      });
    }

    // Update Allfarmproducts table
    const updateAllFarmProductsQuery = `
      UPDATE Allfarmproducts
      SET
        total = ?,
        time = ?,
        date = ?,
        description = ?
      WHERE farmProducts_id = ?;
    `;

    const allFarmProductsParams = [
      total,
      time_added,
      date_added,
      description || null,
      farmProducts_id
    ];

    const [allFarmProductsResult] = await db.execute(updateAllFarmProductsQuery, allFarmProductsParams);

    console.log("Update results:", {
      farmProductAffectedRows: farmProductResult.affectedRows,
      allFarmProductsAffectedRows: allFarmProductsResult.affectedRows
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      updatedProduct: {
        farmProducts_id,
        product_name,
        category_id,
        quantity,
        price,
        total,
        status,
        description,
        image: imageUrl,
        date_added,
        time_added
      }
    });
  } catch (error) {
    console.error("Error updating product:", error);
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
    const farmProducts_id = product_id;

    console.log("Delete product request:", { farmProducts_id, farmer_id: farmer.id });

    const db = pool;

    // Check if the farm product exists and belongs to this farmer
    const [productCheck] = await db.execute(
      'SELECT * FROM farmproducts WHERE id = ? AND farmer_id = ? AND status = "Pending"',
      [farmProducts_id, farmer.id]
    );

    if (productCheck.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found or you are not authorized to delete this product." 
      });
    }

    // Delete from Allfarmproducts table first (due to foreign key constraint)
    const [allFarmProductsResult] = await db.execute(
      'DELETE FROM Allfarmproducts WHERE farmProducts_id = ?',
      [farmProducts_id]
    );

    console.log("Deleted from Allfarmproducts:", allFarmProductsResult.affectedRows, "rows");

    // Delete from farmproducts table
    const [farmProductsResult] = await db.execute(
      'DELETE FROM farmproducts WHERE id = ? AND farmer_id = ? AND status = "Pending"',
      [farmProducts_id, farmer.id]
    );

    console.log("Deleted from farmproducts:", farmProductsResult.affectedRows, "rows");

    if (farmProductsResult.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Failed to delete product." 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "Product deleted successfully.",
      deletedProduct: {
        farmProducts_id,
        product_name: productCheck[0].product_name,
        farmer_id: farmer.id
      }
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ 
      success: false,
      message: "An error occurred while deleting the product.",
      error: error.message
    });
  }
};
