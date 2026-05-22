const fs = require('fs');
const path = require('path');

const imageRepository = require('../repositories/imageRepository');

/**
 * Зберігає метадані завантаженого зображення в базі даних.
 * @param {number} userId
 * @param {Object} file - об'єкт файлу від Multer
 * @returns {Promise<Image>}
 */
const saveImage = (userId, file) => {
  return imageRepository.create({
    userId,
    filename:     file.filename,
    originalName: file.originalname,
    mimeType:     file.mimetype,
    size:         file.size,
  });
};

/**
 * Повертає всі зображення користувача.
 * @param {number} userId
 * @returns {Promise<Image[]>}
 */
const getUserImages = (userId) => {
  return imageRepository.findAllByUser(userId);
};

/**
 * Видаляє зображення: спочатку файл з диску, потім запис з БД.
 * @param {number} imageId
 * @param {number} userId
 * @returns {Promise<void>}
 */
const deleteImage = async (imageId, userId) => {
  const image = await imageRepository.findById(imageId);

  if (!image) {
    const error = new Error('Зображення не знайдено');
    error.status = 404;
    throw error;
  }

  if (image.userId !== userId) {
    const error = new Error('Немає доступу до цього зображення');
    error.status = 403;
    throw error;
  }

  // Видаляємо файл з диску
  const filePath = path.join(__dirname, '../../uploads', image.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await imageRepository.remove(imageId);
};

module.exports = { saveImage, getUserImages, deleteImage };