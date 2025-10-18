const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  businessName: { type: String },
  address: { type: String },
  isApproved: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  cart: [cartItemSchema],
}, { timestamps: true });

// **FIX 1: HASH PASSWORD BEFORE SAVING**
// This middleware runs automatically whenever a new user is created or a password is changed.
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  if (!this.email && !this.phoneNumber) {
    return next(new Error('Either an email or a phone number is required.'));
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// **FIX 2: ADD PASSWORD COMPARISON METHOD**
// This method will be available on all user documents to securely compare passwords.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;