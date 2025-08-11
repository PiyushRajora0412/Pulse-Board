const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail, findById } = require('../models/userModel');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const exists = await findByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(email, hash);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
