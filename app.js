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

// Add preflight OPTIONS handler
app.options('*', cors());

// Updated CORS configuration
app.use(
  cors({
    origin: 'https://storeroomamu.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours in seconds
  })
);

// Add specific headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://storeroomamu.netlify.app');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

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

app.use('/api', routes);

module.exports = app;
