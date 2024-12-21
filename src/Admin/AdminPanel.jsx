import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Tractor, 
  Package, 
  PlusSquare, 
  LogOut 
} from 'lucide-react';
import './AdminPanel.css'; 
import Dashboard from './Dashboard';
import AllUsers from './AllUsers';
import AllSuppliers from './AllSuppliers';
import InventoryPage from './Inventory/InventoryPage';
import AddItems from './Items/AddItems';
// import AllUs from './AllUsers';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigationItems = [
    { 
      icon: <LayoutDashboard className="nav-icon" />, 
      label: 'Dashboard', 
      key: 'dashboard' 
    },
    { 
      icon: <Users className="nav-icon" />, 
      label: 'Users', 
      key: 'users' 
    },
    { 
      icon: <Tractor className="nav-icon" />, 
      label: 'Farmers', 
      key: 'farmers' 
    },
    { 
      icon: <Package className="nav-icon" />, 
      label: 'Inventory', 
      key: 'inventory' 
    },
    { 
      icon: <PlusSquare className="nav-icon" />, 
      label: 'New Items', 
      key: 'newitems' 
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard/>;
      case 'users':
        return <AllUsers/>;
      case 'farmers':
        return <AllSuppliers/>;
      case 'inventory':
        return <InventoryPage/>;
      case 'newitems':
        return <AddItems/>;
      default:
        return <Dashboard/>;
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              className={`nav-button ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button 
            className="logout-button"
            onClick={() => {
              // Implement logout logic here
              console.log('Logging out');
            }}
          >
            <LogOut className="nav-icon" />
            Logout
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="content-card">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const UsersContent = () => (
  <div className="content-section">
    <h1>Users Management</h1>
    {/* Add users table or management interface */}
  </div>
);

const FarmersContent = () => (
  <div className="content-section">
    <h1>Farmers Management</h1>
    {/* Add farmers management interface */}
  </div>
);

const InventoryContent = () => (
  <div className="content-section">
    <h1>Inventory</h1>
    {/* Add inventory management interface */}
  </div>
);

const NewItemsContent = () => (
  <div className="content-section">
    <h1>New Items</h1>
    {/* Add new items addition interface */}
  </div>
);

export default AdminPanel;
