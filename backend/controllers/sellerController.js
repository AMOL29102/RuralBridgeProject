const Seller = require('../models/Seller');

// @desc    Get all sellers (for admin)
// @route   GET /api/sellers
// @access  Private/Admin
exports.getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find({}).select('-password');
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Approve a seller (for admin)
// @route   PUT /api/sellers/:id/approve
// @access  Private/Admin
exports.approveSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);

        if (seller) {
            seller.isApproved = true;
            const updatedSeller = await seller.save();
            res.json(updatedSeller);
        } else {
            res.status(404).json({ error: 'Seller not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};