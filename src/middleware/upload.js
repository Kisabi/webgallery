const multer = require('multer');
const path   = require('path');

/** Дозволені MIME-типи зображень */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/** Максимальний розмір файлу — 5 МБ */
const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Конфігурація сховища Multer.
 * Файли зберігаються в папці /uploads з унікальним іменем:
 * timestamp + оригінальне розширення файлу.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, filename);
  },
});

/**
 * Фільтр файлів — відхиляє непідтримувані MIME-типи.
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Непідтримуваний формат файлу. Дозволено: JPEG, PNG, GIF, WebP'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = upload;