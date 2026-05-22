const imageService = require('../services/imageService');

/**
 * GET /api/images
 * Повертає всі зображення авторизованого користувача.
 */
const getImages = async (req, res, next) => {
  try {
    const images = await imageService.getUserImages(req.user.userId);
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/images
 * Завантажує нове зображення на сервер.
 * Файл обробляється Multer middleware перед викликом контролера.
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не надано' });
    }

    const image = await imageService.saveImage(req.user.userId, req.file);

    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/images/:id
 * Видаляє зображення за ID.
 * Перевіряє що зображення належить авторизованому користувачу.
 */
const deleteImage = async (req, res, next) => {
  try {
    const imageId = parseInt(req.params.id);

    if (isNaN(imageId)) {
      return res.status(400).json({ error: 'Невірний ID зображення' });
    }

    await imageService.deleteImage(imageId, req.user.userId);

    res.status(200).json({ message: 'Зображення успішно видалено' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getImages, uploadImage, deleteImage };