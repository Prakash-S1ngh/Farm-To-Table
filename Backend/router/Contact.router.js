const express = require('express');
const router = express.Router();
const contactController = require('../controller/Contact.controller');
const  {adminAuthorization}  = require('../Admin/middleware/adminAuth.middleware');
// console.log(contactController.submitContactForm);
// Public routes (no authentication required)
router.post('/submit', contactController.submitContactForm);

// Admin routes (require admin authentication)
router.get('/messages', adminAuthorization, contactController.getAllContactMessages);
router.get('/messages/:id', adminAuthorization, contactController.getContactMessageById);
router.put('/messages/:id/status', adminAuthorization, contactController.updateContactStatus);
router.put('/messages/:id/reply', adminAuthorization, contactController.replyToContact);
router.delete('/messages/:id', adminAuthorization, contactController.deleteContactMessage);
router.get('/stats', adminAuthorization, contactController.getContactStats);

module.exports = router;
