const User = require('../models/User');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    const populatedUser = await User.findById(req.user.id).populate('cart.product');
    res.status(201).json(populatedUser.cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { cart: { product: productId } } }
    );
    const populatedUser = await User.findById(req.user.id).populate('cart.product');
    res.json(populatedUser.cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};