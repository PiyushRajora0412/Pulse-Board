const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashed });

    res.status(201).json({
      message: 'User registered',
      user: { id: user._id, email: user.email, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error('[Register Error]', err.code || '', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { _id, email, createdAt } = user;
        res.status(200).json({
      user: { id: _id, email, createdAt }
      });
  } catch (err) {
    console.error('[Auth Check Error]', err.message);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
});

module.exports = router;
