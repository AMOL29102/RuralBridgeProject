const User = require('../models/User');

// @desc    List all sellers
// @route   GET /api/admin/sellers
// @access  Private/Admin
exports.listSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Approve a seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private/Admin
exports.approveSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (seller && seller.role === 'seller') {
      seller.isApproved = true;
      await seller.save();
      res.json({ message: 'Seller approved successfully' });
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Block or Unblock a user
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private/Admin
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};