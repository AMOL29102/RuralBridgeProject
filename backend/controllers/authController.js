const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, phoneNumber, password, role, businessName, address } = req.body;

  // Sanitize inputs: treat empty strings as if they were not provided.
  const finalEmail = email ? email.trim().toLowerCase() : undefined;
  const finalPhoneNumber = phoneNumber ? phoneNumber.trim() : undefined;

  if (!finalEmail && !finalPhoneNumber) {
    return res.status(400).json({ error: 'Either email or phone number is required.' });
  }

  try {
    // Build a query to check if either the email or phone number is already in use.
    const orQuery = [];
    if (finalEmail) orQuery.push({ email: finalEmail });
    if (finalPhoneNumber) orQuery.push({ phoneNumber: finalPhoneNumber });
    
    const userExists = await User.findOne({ $or: orQuery });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email or phone number.' });
    }

    const user = await User.create({
      name,
      email: finalEmail, // Use the sanitized value
      phoneNumber: finalPhoneNumber, // Use the sanitized value
      password,
      role,
      businessName: role === 'seller' ? businessName : undefined,
      address: role === 'seller' ? address : undefined,
      isApproved: role === 'seller' ? false : true,
    });

    if (user.role === 'seller') {
      // For sellers, just send a success message. DO NOT send a token.
      res.status(201).json({ message: 'Seller registration successful. Please wait for admin approval.' });
    } else {
      // For buyers, send the user data and token to log them in immediately.
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    console.error('REGISTRATION ERROR:', error); // Log the actual error for debugging
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  const { loginIdentifier, password } = req.body;
  console.log('Login attempt with identifier:', loginIdentifier, password);

  // 1. Check if inputs are provided
  if (!loginIdentifier || !password) {
    return res.status(400).json({ error: 'Please provide login credentials.' });
  }

  // 2. Sanitize the input to remove whitespace
  const trimmedIdentifier = loginIdentifier.trim();

  try {
    const user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${trimmedIdentifier}$`, 'i') } },
        { phoneNumber: trimmedIdentifier }
      ],
    });
    // console.log(user);

    // 3. Add backend logging for easier debugging
    if (!user) {
      console.log(`Login failed: No user found for identifier "${trimmedIdentifier}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    console.log(isMatch);

    if (!isMatch) {
      console.log(`Login failed: Password mismatch for user "${user.email || user.phoneNumber}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If credentials are correct, proceed with checks and login
    if (user.role === 'seller' && !user.isApproved) {
      return res.status(403).json({ error: 'Your seller account is pending approval.' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ error: 'Your account has been blocked by an administrator.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error('LOGIN SERVER ERROR:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};