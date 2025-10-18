const express = require('express');
const router = express.Router();
const { getAllSellers, approveSeller } = require('../controllers/sellerController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// The error was likely on this line. Notice we are passing the function `getAllSellers`, not the whole controller object.
router.get('/', protect, isAdmin, getAllSellers);

router.put('/:id/approve', protect, isAdmin, approveSeller);

module.exports = router;