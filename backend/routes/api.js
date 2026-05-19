const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth routes (Public)
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Complaint routes
// Note: Declared /complaints/search before other GET operations to prevent Express parameter collisions.
router.get('/complaints/search', complaintController.searchByLocation);
router.post('/complaints', complaintController.addComplaint);
router.get('/complaints', complaintController.getComplaints);
router.put('/complaints/:id', complaintController.updateComplaintStatus);
router.delete('/complaints/:id', complaintController.deleteComplaint);

// AI APIs
router.post('/ai/analyze', complaintController.analyzeComplaintDirect);

module.exports = router;
