// app.js
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const path    = require('path');

const authRoutes       = require('./routes/auth');
const imageRoutes      = require('./routes/images');
const collectionRoutes = require('./routes/collections');
const errorHandler     = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware стек ──────────────────────────────────────────
app.use(cors());                          // дозвіл крос-доменних запитів
app.use(morgan('dev'));                   // логування HTTP-запитів
app.use(express.json());                  // парсинг JSON-тіла запиту
app.use(express.urlencoded({ extended: true })); // парсинг URL-параметрів

// Статичний доступ до завантажених зображень
app.use('/uploads', express.static(path.join(__dirname, '..//uploads')));

// ── Маршрути ────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/images',      imageRoutes);
app.use('/api/collections', collectionRoutes);

// ── Глобальний обробник помилок  ───────────
app.use(errorHandler);
module.exports = app;
