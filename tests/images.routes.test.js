// tests/images.routes.test.js
// Інтеграційні тести маршрутів src/routes/images.js

const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../app');

process.env.JWT_SECRET = 'test_secret_key';

// Мок сервісу — src/services/imageService.js
// Реальні назви методів: getUserImages, saveImage, deleteImage
jest.mock('../src/services/imageService', () => ({
  getUserImages: jest.fn(),
  saveImage:     jest.fn(),
  deleteImage:   jest.fn(),
}));

const imageService = require('../src/services/imageService');

// ─── Допоміжна функція ───────────────────────────────────────────────────────
const generateToken = (userId = 1) =>
  jwt.sign({ userId, email: 'test@test.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

// ─── GET /api/images ──────────────────────────────────────────────────────────

describe('GET /api/images', () => {

  beforeEach(() => jest.clearAllMocks());

  test('401 — без авторизаційного заголовку', async () => {
    const res = await request(app).get('/api/images');
    expect(res.statusCode).toBe(401);
  });

  test('200 — повертає список зображень авторизованого користувача', async () => {
    imageService.getUserImages.mockResolvedValue([
      { id: 1, filename: '111-photo.jpg', originalName: 'cat.jpg', size: 12345 },
      { id: 2, filename: '222-photo.png', originalName: 'dog.png', size: 67890 },
    ]);

    const res = await request(app)
      .get('/api/images')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('filename');
  });

  test('200 — порожній масив, якщо зображень немає', async () => {
    imageService.getUserImages.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/images')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

});

// ─── DELETE /api/images/:id ───────────────────────────────────────────────────

describe('DELETE /api/images/:id', () => {

  beforeEach(() => jest.clearAllMocks());

  test('200 — успішно видаляє зображення', async () => {
    imageService.deleteImage.mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/images/1')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(200);
    expect(imageService.deleteImage).toHaveBeenCalledWith(
      expect.anything(), // imageId (може бути рядком або числом)
      1                  // userId з токена
    );
  });

  test('403 — зображення належить іншому користувачу', async () => {
    const err = new Error('Немає доступу');
    err.status = 403;
    imageService.deleteImage.mockRejectedValue(err);

    const res = await request(app)
      .delete('/api/images/99')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(403);
  });

  test('404 — зображення не існує', async () => {
    const err = new Error('Зображення не знайдено');
    err.status = 404;
    imageService.deleteImage.mockRejectedValue(err);

    const res = await request(app)
      .delete('/api/images/999')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(404);
  });

  test('401 — без авторизаційного заголовку', async () => {
    const res = await request(app).delete('/api/images/1');
    expect(res.statusCode).toBe(401);
  });

});