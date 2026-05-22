const collectionService = require('../services/collectionService');

/**
 * GET /api/collections
 * Повертає всі колекції авторизованого користувача.
 */
const getCollections = async (req, res, next) => {
  try {
    const collections = await collectionService.getUserCollections(req.user.userId);
    res.status(200).json(collections);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/collections
 * Створює нову колекцію.
 * Body: { name }
 */
const createCollection = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Назва колекції обовязкова' });
    }

    const collection = await collectionService.createCollection(req.user.userId, name);
    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/collections/:id
 * Оновлює назву колекції.
 * Body: { name }
 */
const updateCollection = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.id);
    const { name } = req.body;

    if (isNaN(collectionId)) {
      return res.status(400).json({ error: 'Невірний ID колекції' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Назва колекції обовязкова' });
    }

    const collection = await collectionService.updateCollection(
      collectionId,
      req.user.userId,
      name
    );
    res.status(200).json(collection);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/collections/:id
 * Видаляє колекцію за ID.
 */
const deleteCollection = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.id);

    if (isNaN(collectionId)) {
      return res.status(400).json({ error: 'Невірний ID колекції' });
    }

    await collectionService.deleteCollection(collectionId, req.user.userId);
    res.status(200).json({ message: 'Колекцію успішно видалено' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/collections/:id/images
 * Додає зображення до колекції.
 * Body: { imageId }
 */
const addImage = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.id);
    const imageId      = parseInt(req.body.imageId);

    if (isNaN(collectionId) || isNaN(imageId)) {
      return res.status(400).json({ error: 'Невірний ID колекції або зображення' });
    }

    const result = await collectionService.addImageToCollection(
      collectionId,
      imageId,
      req.user.userId
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/collections/:id/images/:imageId
 * Видаляє зображення з колекції.
 */
const removeImage = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.id);
    const imageId      = parseInt(req.params.imageId);

    if (isNaN(collectionId) || isNaN(imageId)) {
      return res.status(400).json({ error: 'Невірний ID колекції або зображення' });
    }

    await collectionService.removeImageFromCollection(
      collectionId,
      imageId,
      req.user.userId
    );
    res.status(200).json({ message: 'Зображення видалено з колекції' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  addImage,
  removeImage,
};