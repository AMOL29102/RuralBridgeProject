const express = require('express');
const router = express.Router();
const { listSellers, approveSeller, toggleBlockUser } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/sellers', protect, isAdmin, listSellers);
router.put('/sellers/:id/approve', protect, isAdmin, approveSeller);
router.put('/users/:id/toggle-block', protect, isAdmin, toggleBlockUser);

module.exports = router;