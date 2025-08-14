import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, Reply, Edit3 } from 'lucide-react';
import './ContactManagement.css';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [editData, setEditData] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/contact/api/v2/messages', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.messages);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/contact/api/v2/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (id, status, priority, adminNotes) => {
    try {
      const response = await fetch(`http://localhost:5000/contact/api/v2/messages/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, priority, admin_notes: adminNotes })
      });
      
      if (response.ok) {
        fetchContacts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:5000/contact/api/v2/messages/${selectedContact.id}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ response_message: replyMessage })
      });
      
      if (response.ok) {
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedContact(null);
        fetchContacts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/contact/api/v2/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchContacts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="status-icon new" />;
      case 'read': return <AlertCircle className="status-icon read" />;
      case 'replied': return <CheckCircle className="status-icon replied" />;
      case 'resolved': return <CheckCircle className="status-icon resolved" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  if (loading) {
    return <div className="loading">Loading contact messages...</div>;
  }

  return (
    <div className="contact-management">
      <div className="contact-header">
        <h1><MessageSquare className="header-icon" /> Contact Management</h1>
        <div className="contact-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.total || 0}</span>
            <span className="stat-label">Total Messages</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.recent || 0}</span>
            <span className="stat-label">New (7 days)</span>
          </div>
        </div>
      </div>

      <div className="contacts-container">
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div key={contact.id} className={`contact-card ${contact.status}`}>
              <div className="contact-header-row">
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <span className="contact-email">{contact.email}</span>
                  <span className={`contact-type ${contact.user_type}`}>
                    {contact.user_type}
                  </span>
                </div>
                <div className="contact-meta">
                  {getStatusIcon(contact.status)}
                  <span className={`priority-badge ${getPriorityColor(contact.priority)}`}>
                    {contact.priority}
                  </span>
                  <span className="contact-date">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="contact-content">
                <h4>{contact.subject}</h4>
                <p>{contact.message}</p>
                {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
              </div>

              {contact.admin_notes && (
                <div className="admin-notes">
                  <strong>Admin Notes:</strong> {contact.admin_notes}
                </div>
              )}

              {contact.response_message && (
                <div className="response-message">
                  <strong>Response:</strong> {contact.response_message}
                  <small>Replied on: {new Date(contact.response_date).toLocaleDateString()}</small>
                </div>
              )}

              <div className="contact-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => {
                    setEditData({
                      status: contact.status,
                      priority: contact.priority,
                      admin_notes: contact.admin_notes || ''
                    });
                    setSelectedContact(contact);
                    setShowEditModal(true);
                  }}
                >
                  <Edit3 size={16} /> Edit
                </button>
                
                <button 
                  className="action-btn reply-btn"
                  onClick={() => {
                    setSelectedContact(contact);
                    setShowReplyModal(true);
                  }}
                >
                  <Reply size={16} /> Reply
                </button>
                
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(contact.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reply to {selectedContact.name}</h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your response..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowReplyModal(false)}>Cancel</button>
              <button onClick={handleReply} className="primary">Send Reply</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedContact && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Contact Message</h3>
            <div className="form-group">
              <label>Status:</label>
              <select 
                value={editData.status} 
                onChange={(e) => setEditData({...editData, status: e.target.value})}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select 
                value={editData.priority} 
                onChange={(e) => setEditData({...editData, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Admin Notes:</label>
              <textarea
                value={editData.admin_notes}
                onChange={(e) => setEditData({...editData, admin_notes: e.target.value})}
                placeholder="Add admin notes..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button 
                onClick={() => {
                  handleStatusUpdate(
                    selectedContact.id, 
                    editData.status, 
                    editData.priority, 
                    editData.admin_notes
                  );
                  setShowEditModal(false);
                }} 
                className="primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
