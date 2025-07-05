# 🌾 FarmToTable - Direct Farm-to-Consumer E-commerce Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-red.svg)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blue.svg)](https://cloudinary.com/)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**FarmToTable** is a comprehensive e-commerce platform that connects farmers directly with consumers, eliminating middlemen and ensuring fresh produce reaches customers at fair prices. The platform features separate interfaces for customers, farmers, and administrators, creating a complete ecosystem for agricultural commerce.

### 🎯 Key Objectives
- **Direct Trade**: Enable farmers to sell directly to consumers
- **Fresh Produce**: Ensure customers get the freshest products
- **Fair Pricing**: Eliminate middleman markups
- **User-Friendly**: Intuitive interfaces for all user types
- **Scalable**: Built with modern, scalable technologies

## ✨ Features

### 👨‍🌾 For Farmers
- **Profile Management**: Complete farmer profile with image upload
- **Product Catalog**: Add, edit, and manage product listings
- **Inventory Tracking**: Real-time inventory management
- **Order Management**: Track orders and sales history
- **Revenue Analytics**: Monitor earnings and performance
- **Product Approval**: Submit products for admin approval

### 🛒 For Customers
- **User Registration & Authentication**: Secure account creation and login
- **Product Browsing**: Browse products by categories with advanced filtering
- **Shopping Cart**: Add, update, and remove items from cart
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders and track order history
- **Profile Management**: Update personal information and preferences
- **Secure Payments**: Integrated payment processing

### 👩‍💼 For Administrators
- **Dashboard Analytics**: Comprehensive business metrics and KPIs
- **User Management**: Manage customers and farmers
- **Product Approval**: Review and approve farmer product listings
- **Inventory Overview**: Monitor platform-wide inventory
- **Revenue Tracking**: Financial analytics and reporting
- **Sales Charts**: Visual representation of sales data
- **Order Management**: Oversee all platform orders

### 🔧 Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Image Upload**: Cloudinary integration for image management
- **Email Notifications**: Automated email system with Nodemailer
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Dynamic content updates
- **Security**: Password hashing with bcrypt
- **CORS Enabled**: Cross-origin resource sharing configured

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Chart.js & Recharts** - Data visualization
- **React Toastify** - User notifications
- **React Icons & Lucide React** - Icon libraries
- **CSS3** - Custom styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL2** - Database driver
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **CORS** - Cross-origin requests
- **Cookie Parser** - Cookie handling

### Cloud & Storage
- **Cloudinary** - Image storage and optimization
- **MySQL** - Relational database
- **Nodemon** - Development server

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development automation
- **Postman** - API testing (recommended)

## 🏗 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │   MySQL DB      │
│                 │◄──►│                 │◄──►│                 │
│ - Customer UI   │    │ - REST APIs     │    │ - User Data     │
│ - Farmer UI     │    │ - Authentication│    │ - Products      │
│ - Admin UI      │    │ - File Upload   │    │ - Orders        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Cloudinary    │
                       │                 │
                       │ - Image Storage │
                       │ - Optimization  │
                       └─────────────────┘
```

## 📁 Project Structure

```
FarmToTable/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── controller/
│   │   ├── User.controller.js
│   │   ├── Farmer.controller.js
│   │   ├── admin.controller.js
│   │   └── Order.controller.js
│   ├── middleware/
│   │   ├── authorization.middleware.js
│   │   └── FarmerAuthorization.middleware.js
│   ├── config/
│   │   └── multer.config.js
│   ├── routes/
│   │   ├── User.routes.js
│   │   ├── Farmer.routes.js
│   │   └── admin.routes.js
│   ├── models/
│   ├── .env
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### 👤 User Routes (`/api/users`)
```
POST   /createUser          - Register new user
POST   /login               - User login
POST   /forgotpassword      - Password reset
POST   /verifying           - OTP validation
GET    /GetUser             - Get user profile
POST   /updateUser          - Update user profile
POST   /orders              - Create order
GET    /getorders           - Get user orders
POST   /createcart          - Add to cart
GET    /getcart             - Get cart items
DELETE /deletecart          - Remove from cart
PATCH  /updateCart          - Update cart item
GET    /wishlist            - Get wishlist
POST   /createwishlist      - Add to wishlist
DELETE /wishlist/:id        - Remove from wishlist
```

### 👨‍🌾 Farmer Routes (`/api/farmers`)
```
POST   /createFarmer        - Register farmer
POST   /farmlogin           - Farmer login
GET    /getFarmer           - Get farmer profile
GET    /getpending          - Get pending products
POST   /updateprofile       - Update farmer profile
POST   /addProducts         - Add new product
GET    /getAllproducts      - Get all products
GET    /gethistory          - Get farmer history
PUT    /updateProduct       - Update product
DELETE /deleteProduct/:id   - Delete product
```

### 👩‍💼 Admin Routes (`/api/admin`)
```
POST   /verifyAdmin         - Admin login
GET    /allUsers            - Get all users
DELETE /delUsers/:id        - Delete user
DELETE /delSuppliers/:id    - Delete supplier
GET    /getAllfarmer        - Get all farmers
GET    /Inventory           - Get inventory
GET    /AddItems            - Get items
POST   /approve             - Approve products
GET    /getProfits          - Get revenue data
GET    /gettotaloders       - Get total orders
GET    /gettotalitems       - Get total products
GET    /gettotalCustomer    - Get total customers
GET    /getRecent           - Get recent orders
GET    /getSales            - Get sales chart data
GET    /getProd             - Get product categories
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/farmtotable.git
cd farmtotable/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables (see below)

# Start the development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Database Setup
```sql
-- Create database
CREATE DATABASE farmToTable;

-- Import your database schema
-- (Add your SQL schema file here)
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
HOST=127.0.0.1
USER=root
PASSWORD=your_mysql_password
DB=farmToTable
PORT_NUM=4000

# JWT Secret
SECRET_KEY=your_jwt_secret_key

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📱 Usage

1. **Customer Journey**:
   - Register/Login to your account
   - Browse products by category
   - Add products to cart or wishlist
   - Place orders and make payments
   - Track order history

2. **Farmer Journey**:
   - Register as a farmer
   - Complete profile setup
   - Add products with images
   - Manage inventory and pricing
   - Track sales and earnings

3. **Admin Journey**:
   - Login to admin dashboard
   - Monitor platform analytics
   - Approve farmer products
   - Manage users and farmers
   - Generate reports

## 📸 Screenshots

*[Add your application screenshots here]*

### Customer Interface
- Product catalog page
- Shopping cart
- Order history

### Farmer Dashboard
- Product management
- Sales analytics
- Profile management

### Admin Panel
- Analytics dashboard
- User management
- Product approval system

## 🚀 Future Enhancements

- [ ] **Mobile App**: React Native mobile application
- [ ] **AI Recommendations**: Machine learning product recommendations
- [ ] **Live Chat**: Real-time customer support
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Analytics**: More detailed reporting
- [ ] **Social Features**: User reviews and ratings
- [ ] **Subscription Model**: Weekly/monthly produce boxes
- [ ] **GPS Integration**: Location-based farmer discovery

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed


## 👨‍💻 Author

**Prakash Kumar Singh **
- GitHub: [Prakash-S1ngh](https://github.com/Prakash-S1ngh)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: prakashsingh.dev14@gmail.com

## 🙏 Acknowledgments

- Thanks to all farmers who inspired this project
- React and Node.js communities for excellent documentation

---

### 📊 Project Stats
- **Total Files**: 50+
- **Lines of Code**: 10,000+
- **Development Time**: 3 months
- **Last Updated**: December 2024

**⭐ Star this repository if you found it helpful!**
