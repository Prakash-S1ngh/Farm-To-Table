// farmerController.js
const express = require('express');
const setupConnection = require('../config/database.config');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const { uploadOnCloudinary } = require('../config/cloudinary.config');
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
        console.log("An error occured in generating the farm_id",error.message);
    }
}
async function getInvetoryId(){
    try {
        const db = await setupConnection(); // Ensure you have a connection
    
        const query = 'SELECT count FROM counters WHERE name = ?';
        const [result] = await db.execute(query, ['inventory']); // Pass 'farmnum' as a string
    
        if (result.length === 0) {
            throw new Error('Counter not found');
        }
    
        let num = result[0].count; // Assuming the column is 'count'
        num++;
        await db.execute('UPDATE counters SET count = ? WHERE name = ?', [num, 'inventory']);
        return `INV${num}`;
    } catch (error) {
        console.log("An error occured in generating the inventory_id",error.message);
    }
} 
async function getproductnum(){
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
        console.log("An error occured in generating prodnum",error.message);
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
        const { first_name, last_name, email, password ,phonenum } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                message: "The Farmer credentials are required"
            });
        }

        const farmerId = await getFarmerId(); // Get the new farmer ID

        const query = 'INSERT INTO suppliers (id , phonenum ,first_name, last_name, email, password) VALUES (?, ?, ?, ?,?, ?)';
        const db = await setupConnection(); // Ensure you have a connection
        const hashedpassword = await bcrypt.hash(password , 10);
       const [result] =  await db.execute(query, [farmerId,phonenum, first_name, last_name, email, hashedpassword]);

        if(result.length === 0){
            return res.status(400).json({
                message:"Failed to create farmer"
            });
        }
        res.status(201).json({ message: "Farmer created successfully", farmerId,farmer:result[0] });
    } catch (error) {
        return res.status(400).json({
            message: "An error occurred in creating a farmer's credentials",
            error: error.message
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
        const [result] = await db.execute(query, [address_id,farmerId, street, state, city, postal_code, country]);

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

exports.photoupload = async(req , res)=>{
    try {
        const user = req.Farmer;
        const imagePath = req.file;
    
        if (!user || !imagePath) {
          return res.status(400).json({
            message: "An error occurred while fetching data"
          });
        }
    
        const query = 'UPDATE suppliers SET profileImage = ? WHERE id = ?';
        const url = await uploadOnCloudinary(imagePath.path); // Use imagePath.path for the file path
        const db = await setupConnection();
    
        // Execute the query and get the result
        const [result] = await db.execute(query, [url, user.id]);
    
        if (result.affectedRows === 0) {
          return res.status(400).json({
            message: "An error occurred while storing data in the Customer table"
          });
        }
    
        return res.status(200).json({
          message: "Farmer profile image uploaded successfully"
        });
    
      } catch (error) {
        return res.status(400).json({
          message: "An error occurred while setting the Farmer's picture",
          error: error.message
        });
      }
};

exports.addproducts = async (req, res) => {
    try {
        const { name, categoryname, price, quantity, describption } = req.body;
        const farmer = req.Farmer;
        const imagePath = req.file; // Assuming you're using multer for handling file uploads

        // Get the current date in the format 'YYYY-MM-DD HH:MM:SS'
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Check if all required fields and the image are provided
        if (!(name && categoryname && price && quantity && describption && imagePath)) {
            return res.json({
                success: false,
                message: "All fields including the product image are required",
            });
        }
        
        
        // Generate necessary IDs
        const invt_id = await getInvetoryId();
        const category_id = categoryname;
        const product_id = await getproductnum();
        
        // Upload the product image to Cloudinary
        const imageUrl = await uploadOnCloudinary(imagePath.path); // Use imagePath.path for the file path
        
        // Establish a connection to the database
        const db = await setupConnection();
        
       
        // Prepare the queries
        const query1 = 'INSERT INTO Inventory (id, product_id, supplier_id, quantity, date_supplied, price, name, description, category_id, prodImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const query2 = 'INSERT INTO Product (product_id, name, description, price, stock, category_id , created_at, prodImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            
        console.log("hello 1");
        // Execute the queries
        const result2 = await db.execute(query2, [product_id, name, describption, price, quantity, category_id, currentDate, imageUrl]);
        const result1 = await db.execute(query1, [invt_id, product_id, farmer.id, quantity, currentDate, price, name, describption, category_id, imageUrl]);
        console.log("hello 2");
        
        // Send a success response
        return res.json({
            success: true,
            message: "Product added successfully",
            data: {
                inventory: result1,
                product: result2
            }
        });
       
    } catch (error) {
        // Handle errors
        return res.status(400).json({
            success: false,
            message: "An error occurred while adding the product",
            error: error.message
        });
    }
};

exports.getFarmer = async (req, res) => {
    const farmerId = req.Farmer;
  
    try {
      // SQL query to get farmer details and address
      console.log("farmer",farmerId);
      const query = `
        SELECT s.id, s.first_name, s.last_name , s.email, s.phonenum, a.street, a.city, a.state, a.postal_code , a.country
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


  exports.getallproduct = async(req ,res)=>{
    try {
        const query = 'SELECT * FROM Product';
        const db = await setupConnection();
        const result = await db.execute(query);
        if(result.length===0)return res.status(400).json({
            success:false,
            message:"The product is not fetched"
        });
        return res.status(200).json({
            success:true,
            message:"The items are fetched",
            result
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"An error ocurred in fetching data ",
            error:error.message
        });
    }
  }


  exports.getFarmerhistory = async (req , res)=>{
    try {
        const farmer = req.Farmer;
        console.log(farmer);
        const query = 'SELECT * FROM inventory WHERE supplier_id = ?';
        const db = await setupConnection();
        const result = await db.execute(query , [farmer.id]);
        if(result.length===0){
            return res.status(400).json({
                success:false,
                message:"the farmer doesn't exist"
            });
        }
        return res.status(200).json({
            success:true,
            message:"The data is fetched",
            data:result[0]
        });


    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"An error occured in getting farmer info",
            error:error.message
        });
    }
  }
  