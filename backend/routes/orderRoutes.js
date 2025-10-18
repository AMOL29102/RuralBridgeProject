const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, orderController.placeOrder);
router.get("/", protect, orderController.getUserOrders);

module.exports = router;