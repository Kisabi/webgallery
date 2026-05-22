const router         = require('express').Router();
const authController = require('../controllers/authController');

/** POST /api/auth/register — реєстрація нового користувача */
router.post('/register', authController.register);

/** POST /api/auth/login — вхід, повернення JWT-токена */
router.post('/login', authController.login);

module.exports = router;