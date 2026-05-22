const router          = require('express').Router();
const imageController = require('../controllers/imageController');
const authMiddleware  = require('../middleware/auth');
const upload          = require('../middleware/upload');

/** Усі маршрути зображень захищені JWT */
router.use(authMiddleware);

/** GET /api/images — список зображень користувача */
router.get('/', imageController.getImages);

/** POST /api/images — завантаження нового зображення */
router.post('/', upload.single('image'), imageController.uploadImage);

/** DELETE /api/images/:id — видалення зображення */
router.delete('/:id', imageController.deleteImage);

module.exports = router;