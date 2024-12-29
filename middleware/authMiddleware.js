const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const authenticateToken = (req, res, next) => {
  let token = req.cookies.token;

  if (token && token.startsWith('token=')) {
    token = token.slice(6); // Remove 'token=' prefix
  }

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err); // Log the error for debugging
      return res.status(403).json({ error: 'Invalid token.' });
    }

    const userId = decoded.id;
    const db = new sqlite3.Database('./database.sqlite');

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err); // Log the error for debugging
        return res.status(500).json({ error: 'Database error.' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      req.user = user;
      next();
    });
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. You do not have the required role.' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
