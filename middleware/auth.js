// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided ❌' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token ❌' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Attach ID and role
    req.userId = decoded.id;
    req.userRole = decoded.role; // 'admin' or 'student'

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired ❌' });
    }
    res.status(401).json({ message: 'Unauthorized ❌' });
  }
};

module.exports = auth;