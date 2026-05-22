const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

const userRepository = require('../repositories/userRepository');

/** Кількість раундів хешування bcrypt */
const SALT_ROUNDS = 10;

/** Термін дії JWT-токена */
const JWT_EXPIRES_IN = '7d';

/**
 * Реєструє нового користувача.
 * Хешує пароль і зберігає користувача в базі даних.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const register = async (email, username, password) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const error = new Error('Користувач з таким email вже існує');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return userRepository.create({ email, username, passwordHash });
};

/**
 * Виконує вхід користувача.
 * Порівнює пароль з хешем і повертає підписаний JWT-токен.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWT-токен
 */
const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Невірний email або пароль');
    error.status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Невірний email або пароль');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return token;
};

module.exports = { register, login };