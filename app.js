const express = require('express');
const routes = require('./routes/routes.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: 'https://storeroomamu.netlify.app',
//     credentials: true,
//   })
// );

app.use(cors());

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, productName TEXT, productSKU TEXT, productPrice REAL, inStore INTEGER NOT NULL DEFAULT 0, onlineOrder INTEGER NOT NULL DEFAULT 0)',
    (err) => {
      if (err) {
        console.error('Error creating products table', err.message);
      } else {
        console.log('Products table created or already exists');
      }
    }
  );

  // Add the new column if it doesn't exist
  db.run('ALTER TABLE products ADD COLUMN IF NOT EXISTS imageUrl TEXT', (err) => {
    if (err) {
      console.error('Error adding imageUrl column', err.message);
    } else {
      console.log('imageUrl column added or already exists');
    }
  });
});

db.run(
  'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT, firstName TEXT, lastName TEXT, role TEXT CHECK(role IN ("admin", "employee")))',
  (err) => {
    if (err) {
      console.error('Error creating users table', err.message);
    } else {
      console.log('Users table created or already exists');
    }
  }
);

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/api', routes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

module.exports = app;
