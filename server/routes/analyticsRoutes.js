const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics for the logged in user
router.get('/dashboard', getDashboardStats);

module.exports = router;
