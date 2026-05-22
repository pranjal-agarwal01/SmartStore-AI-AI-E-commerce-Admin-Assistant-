const express = require('express');
const router = express.Router();
const { recordSale, getDashboardStats } = require('../controllers/salesController');
const { protect } = require('../middleware/auth');

router.post('/', protect, recordSale);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
