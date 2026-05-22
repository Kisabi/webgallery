const collectionRepository = require('../repositories/collectionRepository');
const imageRepository      = require('../repositories/imageRepository');

/**
 * Створює нову колекцію для користувача.
 * @param {number} userId
 * @param {string} name
 * @returns {Promise<Collection>}
 */
const createCollection = (userId, name) => {
  return collectionRepository.create({ userId, name });
};

/**
 * Повертає всі колекції користувача.
 * @param {number} userId
 * @returns {Promise<Collection[]>}
 */
const getUserCollections = (userId) => {
  return collectionRepository.findAllByUser(userId);
};

/**
 * Оновлює назву колекції.
 * Перевіряє що колекція належить користувачу.
 * @param {number} collectionId
 * @param {number} userId
 * @param {string} name
 * @returns {Promise<Collection>}
 */
const updateCollection = async (collectionId, userId, name) => {
  const collection = await collectionRepository.findById(collectionId);

  if (!collection) {
    const error = new Error('Колекцію не знайдено');
    error.status = 404;
    throw error;
  }

  if (collection.userId !== userId) {
    const error = new Error('Немає доступу до цієї колекції');
    error.status = 403;
    throw error;
  }

  return collectionRepository.update(collectionId, name);
};

/**
 * Видаляє колекцію.
 * Перевіряє що колекція належить користувачу.
 * @param {number} collectionId
 * @param {number} userId
 * @returns {Promise<void>}
 */
const deleteCollection = async (collectionId, userId) => {
  const collection = await collectionRepository.findById(collectionId);

  if (!collection) {
    const error = new Error('Колекцію не знайдено');
    error.status = 404;
    throw error;
  }

  if (collection.userId !== userId) {
    const error = new Error('Немає доступу до цієї колекції');
    error.status = 403;
    throw error;
  }

  await collectionRepository.remove(collectionId);
};

/**
 * Додає зображення до колекції.
 * Перевіряє права доступу до колекції та зображення.
 * @param {number} collectionId
 * @param {number} imageId
 * @param {number} userId
 * @returns {Promise<ImageCollection>}
 */
const addImageToCollection = async (collectionId, imageId, userId) => {
  const collection = await collectionRepository.findById(collectionId);
  if (!collection || collection.userId !== userId) {
    const error = new Error('Колекцію не знайдено або немає доступу');
    error.status = 403;
    throw error;
  }

  const image = await imageRepository.findById(imageId);
  if (!image || image.userId !== userId) {
    const error = new Error('Зображення не знайдено або немає доступу');
    error.status = 403;
    throw error;
  }

  return collectionRepository.addImage(imageId, collectionId);
};

/**
 * Видаляє зображення з колекції.
 * @param {number} collectionId
 * @param {number} imageId
 * @param {number} userId
 * @returns {Promise<void>}
 */
const removeImageFromCollection = async (collectionId, imageId, userId) => {
  const collection = await collectionRepository.findById(collectionId);
  if (!collection || collection.userId !== userId) {
    const error = new Error('Колекцію не знайдено або немає доступу');
    error.status = 403;
    throw error;
  }

  await collectionRepository.removeImage(imageId, collectionId);
};

module.exports = {
  createCollection,
  getUserCollections,
  updateCollection,
  deleteCollection,
  addImageToCollection,
  removeImageFromCollection,
};