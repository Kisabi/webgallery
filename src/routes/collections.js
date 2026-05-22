const router               = require('express').Router();
const collectionController = require('../controllers/collectionController');
const authMiddleware       = require('../middleware/auth');

/** Усі маршрути колекцій захищені JWT */
router.use(authMiddleware);

/** GET /api/collections — список колекцій користувача */
router.get('/', collectionController.getCollections);

/** POST /api/collections — створення нової колекції */
router.post('/', collectionController.createCollection);

/** PUT /api/collections/:id — оновлення назви колекції */
router.put('/:id', collectionController.updateCollection);

/** DELETE /api/collections/:id — видалення колекції */
router.delete('/:id', collectionController.deleteCollection);

/** POST /api/collections/:id/images — додавання зображення до колекції */
router.post('/:id/images', collectionController.addImage);

/** DELETE /api/collections/:id/images/:imageId — видалення зображення з колекції */
router.delete('/:id/images/:imageId', collectionController.removeImage);

module.exports = router;