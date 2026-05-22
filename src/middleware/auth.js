const jwt = require('jsonwebtoken');

/**
 * Middleware перевірки JWT-токена.
 * Витягує токен з заголовку Authorization (Bearer <token>),
 * верифікує його і записує дані користувача в req.user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Токен відсутній' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Токен недійсний або прострочений' });
  }
};

module.exports = authMiddleware;