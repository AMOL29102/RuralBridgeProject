const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  paymentId: String,
  paid: { type: Boolean, default: false },
  paidAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
