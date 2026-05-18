const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth routes (Public)
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Candidate routes (Protected)
router.post('/candidates', authMiddleware, candidateController.addCandidate);
router.get('/candidates', authMiddleware, candidateController.getCandidates);
router.get('/dashboard/stats', authMiddleware, candidateController.getDashboardStats);
router.post('/match', authMiddleware, candidateController.matchCandidates);
router.post('/ai/shortlist', authMiddleware, candidateController.aiShortlist);
router.post('/chat', authMiddleware, candidateController.chatWithBot);

module.exports = router;
