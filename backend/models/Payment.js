const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  paymentId: { type: String },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  amount: { type: Number, required: true },
  method: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);