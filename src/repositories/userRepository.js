const prisma = require('../prismaClient');

/**
 * Знаходить користувача за email.
 * @param {string} email
 * @returns {Promise<User|null>}
 */
const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Створює нового користувача в базі даних.
 * @param {Object} data - { email, username, passwordHash }
 * @returns {Promise<User>}
 */
const create = (data) => {
  return prisma.user.create({ data });
};

module.exports = { findByEmail, create };