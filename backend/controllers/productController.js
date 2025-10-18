const Product = require('../models/Product');
const User = require('../models/User'); // Import the User model
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');

// @desc    Get ALL products for marketplace
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('user', 'businessName');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  try {
    // Populate seller's contact info
    const product = await Product.findById(req.params.id).populate('user', 'businessName email phoneNumber');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a new product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ruralbridge/products',
    });
    const product = new Product({
      name,
      price,
      description,
      image: result.secure_url,
      user: req.user.id,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get products for the logged-in seller
// @route   GET /api/products/seller/mine
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    let updateData = { name, price, description };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ruralbridge/products',
      });
      updateData.image = result.secure_url;
    }
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOneAndDelete({ _id: productId, user: req.user.id });

    if (!product) {
      return res.status(404).json({ error: 'Not found or not authorized' });
    }

    // After deleting the product, remove it from all user carts.
    await User.updateMany(
      {},
      { $pull: { cart: { product: productId } } }
    );

    res.json({ message: 'Product deleted successfully and removed from all carts.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};