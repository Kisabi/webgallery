const authService = require('../services/authService');

/**
 * POST /api/auth/register
 * Реєструє нового користувача.
 * Body: { email, username, password }
 */
const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Усі поля обовязкові' });
    }

    const user = await authService.register(email, username, password);

    res.status(201).json({
      message: 'Користувача успішно зареєстровано',
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Виконує вхід користувача, повертає JWT-токен.
 * Body: { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email і пароль обовязкові' });
    }

    const token = await authService.login(email, password);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };