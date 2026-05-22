const prisma = require('../prismaClient');

/**
 * Зберігає метадані зображення в базі даних.
 * @param {Object} data - { userId, filename, originalName, mimeType, size }
 * @returns {Promise<Image>}
 */
const create = (data) => {
  return prisma.image.create({ data });
};

/**
 * Повертає всі зображення конкретного користувача.
 * @param {number} userId
 * @returns {Promise<Image[]>}
 */
const findAllByUser = (userId) => {
  return prisma.image.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
  });
};

/**
 * Знаходить зображення за ID.
 * @param {number} id
 * @returns {Promise<Image|null>}
 */
const findById = (id) => {
  return prisma.image.findUnique({ where: { id } });
};

/**
 * Видаляє зображення за ID.
 * @param {number} id
 * @returns {Promise<Image>}
 */
const remove = (id) => {
  return prisma.image.delete({ where: { id } });
};

module.exports = { create, findAllByUser, findById, remove };