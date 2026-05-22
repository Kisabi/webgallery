const prisma = require('../prismaClient');

/**
 * Створює нову колекцію.
 * @param {Object} data - { userId, name }
 * @returns {Promise<Collection>}
 */
const create = (data) => {
  return prisma.collection.create({ data });
};

/**
 * Повертає всі колекції користувача разом із зображеннями.
 * @param {number} userId
 * @returns {Promise<Collection[]>}
 */
const findAllByUser = (userId) => {
  return prisma.collection.findMany({
    where: { userId },
    include: { images: { include: { image: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Знаходить колекцію за ID.
 * @param {number} id
 * @returns {Promise<Collection|null>}
 */
const findById = (id) => {
  return prisma.collection.findUnique({
    where: { id },
    include: { images: { include: { image: true } } },
  });
};

/**
 * Оновлює назву колекції.
 * @param {number} id
 * @param {string} name
 * @returns {Promise<Collection>}
 */
const update = (id, name) => {
  return prisma.collection.update({ where: { id }, data: { name } });
};

/**
 * Видаляє колекцію за ID.
 * @param {number} id
 * @returns {Promise<Collection>}
 */
const remove = (id) => {
  return prisma.collection.delete({ where: { id } });
};

/**
 * Додає зображення до колекції.
 * @param {number} imageId
 * @param {number} collectionId
 * @returns {Promise<ImageCollection>}
 */
const addImage = (imageId, collectionId) => {
  return prisma.imageCollection.create({ data: { imageId, collectionId } });
};

/**
 * Видаляє зображення з колекції.
 * @param {number} imageId
 * @param {number} collectionId
 * @returns {Promise<ImageCollection>}
 */
const removeImage = (imageId, collectionId) => {
  return prisma.imageCollection.delete({
    where: { imageId_collectionId: { imageId, collectionId } },
  });
};

module.exports = { create, findAllByUser, findById, update, remove, addImage, removeImage };