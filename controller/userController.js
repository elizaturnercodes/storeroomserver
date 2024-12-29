const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Terminal commands to install required packages:
// npm install sqlite3
// npm install jsonwebtoken
// npm install bcrypt

// Create User
exports.createUser = (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const db = req.db;

  db.run('INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, firstName, lastName, role], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
};

// Get All Users
exports.getAllUsers = (req, res) => {
  const db = req.db;
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Read User
exports.getUser = (req, res) => {
  const { id } = req.params;

  const db = req.db;

  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(row);
  });
};

// Update User
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { email, password, firstName, lastName, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const db = req.db;

  db.run(
    'UPDATE users SET email = ?, password = ?, firstName = ?, lastName = ?, role = ? WHERE id = ?',
    [email, hashedPassword, firstName, lastName, role, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json(row);
      });
    }
  );
};

// Delete User
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const db = req.db;

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ changes: this.changes });
  });
};

// Register User
exports.register = (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const db = req.db;

  db.run('INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, firstName, lastName, role], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { password: _, ...userData } = row; // Exclude password from user data
      res.status(201).json({ message: 'Register successful', user: userData });
    });
  });
};

// Login User
exports.login = (req, res) => {
  const { email, password } = req.body;

  const db = req.db;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    const { password: _, ...userData } = row; // Exclude password from user data
    res.status(200).json({ status: 'success', message: 'Login successful', user: userData });
  });
};

// Logout User
exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0) });
  res.status(200).json({ message: 'Logout successful' });
};
