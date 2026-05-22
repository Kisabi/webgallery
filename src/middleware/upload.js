const multer = require('multer');
const path   = require('path');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const MAX_SIZE = 5 * 1024 * 1024;

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
 * Фільтр файлів — перевіряє MIME-тип або розширення файлу.
 */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidMime = ALLOWED_TYPES.includes(file.mimetype);
  const isValidExt  = ALLOWED_EXTENSIONS.includes(ext);

  if (isValidMime || isValidExt) {
    cb(null, true);
  } else {
    const error = new Error('Непідтримуваний формат файлу. Дозволено: JPEG, PNG, GIF, WebP');
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = upload;