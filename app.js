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

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

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
  // db.all('PRAGMA table_info(products)', (err, columns) => {
  //   if (err) {
  //     console.error('Error checking products table columns', err.message);
  //   } else {
  //     const columnNames = columns.map((column) => column.name);
  //     if (!columnNames.includes('orderedQuantity')) {
  //       db.run('ALTER TABLE products ADD COLUMN orderedQuantity INTEGER NOT NULL DEFAULT 0', (err) => {
  //         if (err) {
  //           console.error('Error adding orderedQuantity column', err.message);
  //         } else {
  //           console.log('orderedQuantity column added to products table');
  //         }
  //       });
  //     }
  //   }
  // });

  // db.all('PRAGMA table_info(products)', (err, columns) => {
  //   if (err) {
  //     console.error('Error checking products table columns', err.message);
  //   } else {
  //     const columnNames = columns.map((column) => column.name);
  //     if (!columnNames.includes('imageUrl')) {
  //       db.run('ALTER TABLE products ADD COLUMN imageUrl TEXT', (err) => {
  //         if (err) {
  //           console.error('Error adding imageUrl column', err.message);
  //         } else {
  //           console.log('imageUrl column added to products table');
  //         }
  //       });
  //     }
  //   }
  // });
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
