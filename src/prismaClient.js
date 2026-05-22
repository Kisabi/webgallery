const { PrismaClient } = require('@prisma/client');

/**
 * Єдиний екземпляр Prisma Client для всього застосунку.
 */
const prisma = new PrismaClient();

module.exports = prisma;