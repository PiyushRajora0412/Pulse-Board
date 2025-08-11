const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
