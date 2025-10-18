const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, isSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- Public Marketplace Routes ---
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// --- Seller Dashboard Routes ---
router.get('/seller/mine', protect, isSeller, productController.getSellerProducts);
router.post('/', protect, isSeller, upload.single('image'), productController.createProduct);
router.put('/:id', protect, isSeller, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, isSeller, productController.deleteProduct);

module.exports = router;