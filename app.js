const express = require('express');
const routes = require('./routes/routes.js');
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

// CORS configuration
app.use(
  cors({
    origin: ['https://storeroomclient.vercel.app', 'https://storeroomamu.netlify.app/', 'https://storeroomserver.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use('/api', routes);

module.exports = app;
