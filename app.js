const express = require('express');
const routes = require('./routes/routes.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongooseSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// );

app.options('*', cors());

app.use(
  cors({
    origin: 'https://storeroomamu.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours in seconds
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://storeroomamu.netlify.app');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use('/api', routes);

module.exports = app;
