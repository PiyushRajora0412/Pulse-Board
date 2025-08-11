require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'PulseBoard API running' }));

app.use('/auth', authRoutes);
app.use('/goals', goalRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
