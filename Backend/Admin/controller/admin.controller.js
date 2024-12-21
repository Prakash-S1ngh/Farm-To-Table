const { connection, setupConnection } = require("../../config/database.config");
const jwt = require('jsonwebtoken');

exports.loginadmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!(email && password)) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Query to find admin by email and password
        const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
        const db = await connection;
        const [result] = await db.execute(query, [email, password]);

        // Check if admin exists in the database
        if (!result || result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT token
        const admin = result[0]; // The logged-in admin data
        const token = jwt.sign(
            { id: admin.email, name: admin.name }, // Payload
            process.env.SECRET_KEY,               // Secret Key
            { expiresIn: '1h' }                   // Options
        );

        // Set cookie and send response
        res.cookie("admin", token, {
            httpOnly: true, // Prevent client-side access to cookies
            secure: process.env.NODE_ENV === 'production', // Use secure flag in production
        });

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully.",
            token, // Optional: Include the token in the response if needed
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in.",
            error: error.message
        });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT 
                Customer.customer_id, 
                Customer.profile_image,
                Customer.first_name, 
                Customer.last_name,
                Customer.email, 
                COUNT(Orders.order_id) AS total_orders
            FROM 
                Customer
            LEFT JOIN 
                Orders ON Customer.customer_id = Orders.customer_id
            GROUP BY 
                Customer.customer_id
            ORDER BY 
                total_orders DESC
        `;
        const db = await setupConnection(); // Ensure you await the connection
        console.log("Database ", db);
        const [result] = await db.execute(query); // Execute the query

        return res.status(200).json({
            success: true,
            message: "All users are here, sorted by maximum orders placed.",
            users: result, // Return the sorted result set
        });
    } catch (error) {
        console.error("Error fetching all users:", error); // Log the error
        return res.status(400).json({
            success: false,
            message: "An error occurred while getting user info.",
            error: error.message, // Include error details for debugging
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { customer_id } = req.params;

        // Check if `customer_id` is provided
        if (!customer_id) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required to delete a user.",
            });
        }

        // Query to delete the user
        const query = 'DELETE FROM Customer WHERE customer_id = ?';
        const db = await setupConnection();
        const [result] = await db.execute(query, [customer_id]);

        // Check if a user was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `No user found with customer_id: ${customer_id}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting user:", error); // Log the error
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user.",
            error: error.message,
        });
    }
};



exports.getAllSuppliers = async (req, res) => {
    try {
        const { view } = req.query; // Get the view parameter

        // Base query for fetching suppliers with aggregated data
        let query = `
            SELECT 
                suppliers.id,
                suppliers.first_name,
                suppliers.last_name,
                suppliers.email,
                suppliers.phonenum,
                suppliers.profileImage,
                COUNT(Order_Details.order_id) AS total_orders,
                COUNT(DISTINCT inventory.product_id) AS items_listed, 
                SUM(Order_Details.quantity) AS items_sold
            FROM 
                suppliers
            LEFT JOIN 
                inventory ON suppliers.id = inventory.supplier_id
            LEFT JOIN 
                Order_Details ON inventory.product_id = Order_Details.product_id
            GROUP BY 
                suppliers.id
            ORDER BY 
                total_orders DESC
        `;

        // Adjust query based on the view parameter (items_listed or items_sold)
        if (view === "items_listed") {
            query = query.replace("SUM(Order_Details.quantity) AS items_sold", "0 AS items_sold");
        } else if (view === "items_sold") {
            query = query.replace("COUNT(DISTINCT inventory.product_id) AS items_listed", "0 AS items_listed");
        }

        // Establish a database connection
        const db = await setupConnection();

        // Execute the query
        const [result] = await db.execute(query);

        // Return the result as a JSON response
        return res.status(200).json({
            success: true,
            message: "All suppliers are here, sorted by top sellers.",
            suppliers: result,
        });
    } catch (error) {
        console.error("Error fetching all suppliers:", error); // Log the error for debugging

        // Return an error response
        return res.status(400).json({
            success: false,
            message: "An error occurred while getting supplier info.",
            error: error.message, // Include error details for better insight
        });
    }
};




exports.deleteSupplier = async (req, res) => {
    try {
        const { supplier_id } = req.params;

        // Check if `supplier_id` is provided
        if (!supplier_id) {
            return res.status(400).json({
                success: false,
                message: "Supplier ID is required to delete a supplier.",
            });
        }

        // Query to delete the supplier
        const query = 'DELETE FROM suppliers WHERE id = ?';
        const db = await setupConnection();
        const [result] = await db.execute(query, [supplier_id]);

        // Check if a supplier was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `No supplier found with supplier_id: ${supplier_id}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Supplier deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting supplier:", error); // Log the error
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the supplier.",
            error: error.message,
        });
    }
};

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

exports.acceptProducts = async (req, res) => {
    try {
        const { id, name, categoryname, price, quantity, description, prodImage } = req.body;

        // Validate input
        if (!id || !name || !categoryname || !price || !quantity || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const db = await connection;
        // Insert data into Inventory table
        const inventoryQuery = `
            INSERT INTO Inventory (product_id, supplier_id, prodImage, category_id, quantity, date_supplied, price, description) 
            VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`;
        const prodId = await getproductnum();
        const inventoryValues = [prodId, id, prodImage, categoryname, quantity, price, description]; // Assuming supplier_id is from logged-in user (req.user)

        await db.promise().query(inventoryQuery, inventoryValues);

        // Insert data into Product table
        const productQuery = `
            INSERT INTO Product (product_id, name, description, price, stock, created_at, prodImage) 
            VALUES (?, ?, ?, ?, ?, NOW(), ?)`;
        const productValues = [prodId, name, description, price, quantity, prodImage];

        await db.promise().query(productQuery, productValues);

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Your products are accepted",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "An error occurred in accepting products",
        });
    }
};


exports.getInventory = async (req, res) => {
    try {
        const query = `
            SELECT 
                inventory.id,
                inventory.product_id,
                inventory.category_id,
                inventory.quantity,
                inventory.date_supplied,
                inventory.price,
                inventory.name,
                inventory.description,
                inventory.prodImage,
                inventory.supplier_id AS supplierId ,
                suppliers.first_name ,
                suppliers.last_name
            FROM inventory
            INNER JOIN suppliers ON inventory.supplier_id = suppliers.id
            INNER JOIN Category ON Category.category_id = inventory.category_id;
        `;
        const db = await setupConnection();
        const [rows] = await db.query(query);

        // Group the products by supplier_id
        const groupedBySupplier = rows.reduce((acc, product) => {
            const { supplierId, first_name, last_name, ...productDetails } = product;
        
            // Merge first_name and last_name to create supplier_name
            const supplier_name = `${first_name} ${last_name}`;
        
            if (!acc[supplierId]) {
                acc[supplierId] = {
                    supplier_name, // Use the merged supplier_name
                    products: []
                };
            }
        
            acc[supplierId].products.push(productDetails);
            return acc;
        }, {});
        

      

        res.status(200).json(groupedBySupplier);
    } catch (error) {
        console.error('Error fetching inventory data:', error);
        res.status(500).json({ error: 'Error fetching inventory data' });
    }
};


// Delete inventory item
exports.deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM inventory WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Error deleting item' });
    }
};


//getItems 
exports.getItems = async (req, res) => {
    try {
        const query = 'SELECT * FROM Allfarmproducts'; // Query to get all farm products
        const query2 = 'SELECT * FROM farmproducts WHERE farmer_id = ?'; // Query to get products for a specific farmer
        const db = await setupConnection(); // Setting up database connection

        // Fetch all farm products
        const [allFarmProducts] = await db.execute(query);

        // Check if Allfarmproducts is empty
        if (allFarmProducts.length === 0) {
            return res.status(404).json({ message: 'No farm products found.' });
        }

        // Create an object to group results by farmer_id
        const farmersProductsMap = {};

        // Create an object to store all the products for each farmer
        const farmerProductsMap = {};

        // Loop through each farmProduct in Allfarmproducts
        for (const farmProduct of allFarmProducts) {
            console.log("1");
            const farmerId = farmProduct.farmer_id;

            // If the farmer's products haven't been fetched yet, fetch them
            if (!farmerProductsMap[farmerId]) {
                const [farmerProducts] = await db.execute(query2, [farmerId]);
                farmerProductsMap[farmerId] = farmerProducts;
            }

            // Now that we have the products for this farmer, add them to the map
            if (!farmersProductsMap[farmerId]) {
                farmersProductsMap[farmerId] = {
                    farmerId,
                    totalQuantity: 0,
                    totalPrice: 0,
                    products: [],
                    lastUpdated: farmProduct.updated_at, // Assuming there's a timestamp column
                };
            }

            // Aggregate product details for this farmer (only once per farmer)
            farmerProductsMap[farmerId].forEach((product) => {
                // Add each product only once
                const existingProduct = farmersProductsMap[farmerId].products.some(
                    (p) => p.product_name === product.product_name
                );

                if (!existingProduct) {
                    console.log("2");
                    farmersProductsMap[farmerId].products.push(product);
                    farmersProductsMap[farmerId].totalQuantity += parseFloat(product.quantity);
                    farmersProductsMap[farmerId].totalPrice += parseFloat(product.price);
                }
            });

            // Update the last updated timestamp (or any other meta information)
            farmersProductsMap[farmerId].lastUpdated = new Date(); // Update to the current timestamp
        }

        // Convert the map to an array for response
        const farmersProducts = Object.values(farmersProductsMap);

        // Send the response with the structured data
        res.status(200).json(farmersProducts);

    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Failed to retrieve farm products.' });
    }
};

async function getInventoryId() {
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
        console.log("An error occured in generating the inventory_id", error.message);
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


exports.approve = async (req, res) => {
    try {
        const { farmer_id } = req.body;

        if (!farmer_id) {
            return res.status(400).json({ message: 'Farmer ID is required.' });
        }

        const db = await setupConnection(); // Setting up database connection

        // Query to fetch all farmProduct_ids for the given farmer_id
        const fetchFarmProductsQuery = `
            SELECT farmProducts_id FROM farmproducts WHERE farmer_id = ?;
        `;
        const [farmProducts] = await db.execute(fetchFarmProductsQuery, [farmer_id]);

        if (farmProducts.length === 0) {
            return res.status(404).json({ message: 'No farm products found or all products are already approved.' });
        }

        const farmProducts_ids = farmProducts.map(product => product.farmProducts_id);
        const productDetails = [];

        for (const id of farmProducts_ids) {
            const updateStatusQuery = `
                UPDATE farmproducts
                SET status = 'approved'
                WHERE farmProducts_id = ?;
            `;
            const [updateResult] = await db.execute(updateStatusQuery, [id]);

            if (updateResult.affectedRows > 0) {
                const fetchProductQuery = `
                    SELECT product_name, description, category_id, quantity, image, price
                    FROM farmproducts
                    WHERE farmProducts_id = ?;
                `;
                const [product] = await db.execute(fetchProductQuery, [id]);
                if (product.length > 0) {
                    productDetails.push(product[0]);
                }
            }
        }

        if (productDetails.length === 0) {
            return res.status(404).json({ message: 'No farm products found for the given IDs.' });
        }

        const date_supplied = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const inventoryItems = [];
        const productItems = [];
        console.log("items",productDetails);

        for (const product of productDetails) {
            const { product_name, description, category_id, quantity, image, price } = product;

            const product_id = await getproductnum();
            const inven_id = await getInventoryId();
            console.log("hi");

            productItems.push([
                product_id,
                product_name,
                description || 'None',
                price,
                quantity,
                category_id,
                date_supplied,
                image || null,
            ]);

            inventoryItems.push([
                inven_id,
                product_id,
                farmer_id,
                category_id,
                quantity,
                date_supplied,
                price,
                product_name,
                description || "None",
                image,
            ]);
        }

        const productPlaceholders = productItems.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
        const addToProductQuery = `
            INSERT INTO product (product_id, name, description, price, stock, category_id, created_at, prodImage)
            VALUES ${productPlaceholders};
        `;
        const flattenedProductItems = productItems.flat();
        await db.execute(addToProductQuery, flattenedProductItems);

        const inventoryPlaceholders = inventoryItems.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
        const addToInventoryQuery = `
            INSERT INTO inventory (id, product_id, supplier_id, category_id, quantity, date_supplied, price, name, description, prodImage)
            VALUES ${inventoryPlaceholders};
        `;
        const flattenedInventoryItems = inventoryItems.flat();
        await db.execute(addToInventoryQuery, flattenedInventoryItems);

        // DELETE all records from AllfarmProducts for the given farmer
        const deleteAllFarmProductsQuery = `
            DELETE FROM AllfarmProducts WHERE farmer_id = ?;
        `;
        await db.execute(deleteAllFarmProductsQuery, [farmer_id]);

        res.status(200).json({
            message: 'Farm products approved, added to Product table, added to Inventory table, and cleared from AllfarmProducts table.'
        });
    } catch (error) {
        console.error('Error approving farm products:', error);
        res.status(500).json({ message: 'Failed to approve farm products.' });
    }
};



exports.getrevenue = async (req, res) => {
    try {
        const db = await setupConnection(); // Setting up database connection

        // Query to get the total revenue, current month total, previous month total, profit ratio, and total sum of all products
        const revenueQuery = `
            SELECT 
                -- Current Month's total sum
                SUM(CASE 
                        WHEN MONTH(order_date) = MONTH(CURRENT_DATE()) 
                             AND YEAR(order_date) = YEAR(CURRENT_DATE()) 
                        THEN total_amount 
                        ELSE 0 
                    END) AS current_month_total_sum,

                -- Previous Month's total sum
                SUM(CASE 
                        WHEN MONTH(order_date) = MONTH(CURRENT_DATE()) - 1 
                             AND YEAR(order_date) = YEAR(CURRENT_DATE()) 
                        THEN total_amount 
                        ELSE 0 
                    END) AS previous_month_total_sum,

                -- Profit ratio
                IFNULL(
                    (SUM(CASE 
                            WHEN MONTH(order_date) = MONTH(CURRENT_DATE()) 
                                 AND YEAR(order_date) = YEAR(CURRENT_DATE()) 
                            THEN total_amount 
                            ELSE 0 
                        END) / 
                    SUM(CASE 
                            WHEN MONTH(order_date) = MONTH(CURRENT_DATE()) - 1 
                                 AND YEAR(order_date) = YEAR(CURRENT_DATE()) 
                            THEN total_amount 
                            ELSE 0 
                        END) - 1), 
                    0) AS profit_ratio,

                -- Total sum of all products until now
                SUM(total_amount) AS total_sum_of_all_products
            FROM Orders;
        `;
        const [result] = await db.execute(revenueQuery);

        // Check if the result contains valid data
        if (result.length === 0) {
            return res.status(404).json({ message: 'No revenue data found.' });
        }

        // Send success response with the total revenue, current month total, previous month total, profit ratio, and total sum of all products
        res.status(200).json({
            current_month_total_sum: result[0].current_month_total_sum,
            previous_month_total_sum: result[0].previous_month_total_sum,
            profit_ratio: result[0].profit_ratio,
            total_sum_of_all_products: result[0].total_sum_of_all_products
        });

    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ message: 'Failed to fetch revenue. Please try again later.' });
    }
};


exports.gettotalorders = async (req, res) => {
    try {
        const query = 'SELECT COUNT(order_id) AS totalOrders FROM Orders'; // Using COUNT instead of total to count rows
        const db = await setupConnection(); // Setting up database connection
        const [result] = await db.execute(query);

        // Check if the result is empty
        if (result.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        // Send success response with the total orders count
        res.status(200).json({ totalOrders: result[0].totalOrders });

    } catch (error) {
        console.error('Error fetching total orders:', error);
        res.status(500).json({ message: 'Failed to fetch total orders. Please try again later.' });
    }
};


exports.gettotalproducts = async (req, res) => {
    try {
        const query = 'SELECT COUNT(product_id) AS totalProducts FROM Product'; // Counting total products
        const db = await setupConnection(); // Setting up database connection
        const [result] = await db.execute(query);

        // Check if the result is empty
        if (result.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        // Send success response with the total products count
        res.status(200).json({ totalProducts: result[0].totalProducts });

    } catch (error) {
        console.error('Error fetching total products:', error);
        res.status(500).json({ message: 'Failed to fetch total products. Please try again later.' });
    }
};

exports.gettotalcustomers = async (req, res) => {
    try {
        const query = 'SELECT COUNT(customer_id) AS totalCustomers FROM Customer'; // Counting total customers
        const db = await setupConnection(); // Setting up database connection
        const [result] = await db.execute(query);

        // Check if the result is empty
        if (result.length === 0) {
            return res.status(404).json({ message: 'No customers found.' });
        }

        // Send success response with the total customers count
        res.status(200).json({ totalCustomers: result[0].totalCustomers });

    } catch (error) {
        console.error('Error fetching total customers:', error);
        res.status(500).json({ message: 'Failed to fetch total customers. Please try again later.' });
    }
};



exports.getRecentOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.customer_id, 
                c.first_name, 
                c.last_name, 
                COUNT(o.order_id) AS order_count,
                SUM(o.total_amount) AS total_price
            FROM Customer c
            JOIN orders o ON c.customer_id = o.customer_id
            GROUP BY c.customer_id
            ORDER BY order_count DESC
            LIMIT 5;
        `;
        
        const db = await setupConnection(); // Set up database connection
        const [result] = await db.execute(query);

        // Check if no recent orders found
        if (result.length === 0) {
            return res.status(404).json({ message: 'No recent orders found.' });
        }

        // Send success response with the top 5 customers and their total spent amount
        res.status(200).json({ recentOrders: result });

    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ message: 'Failed to fetch recent orders. Please try again later.' });
    }
};



