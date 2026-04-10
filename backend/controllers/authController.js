const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body || {};
    if (!email || !password) {
      console.log('Login missing credentials');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    console.log(`Login attempt for ${email}`);
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      console.log(`Login success for ${email}`);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
    console.log(`Login failed for ${email}`);
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Register a new user (admin only)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role });
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
    return res.status(400).json({ message: 'Invalid user data' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { loginUser, registerUser };