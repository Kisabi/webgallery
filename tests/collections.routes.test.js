// tests/collections.routes.test.js
// Інтеграційні тести маршрутів src/routes/collections.js

const request           = require('supertest');
const jwt               = require('jsonwebtoken');
const app               = require('../app');

process.env.JWT_SECRET = 'test_secret_key';

// Мок сервісу — src/services/collectionService.js
// Реальні назви методів: getUserCollections, createCollection, updateCollection, deleteCollection
jest.mock('../src/services/collectionService', () => ({
  getUserCollections:   jest.fn(),
  createCollection:     jest.fn(),
  updateCollection:     jest.fn(),
  deleteCollection:     jest.fn(),
  addImageToCollection: jest.fn(),
}));

const collectionService = require('../src/services/collectionService');

// ─── Допоміжна функція ───────────────────────────────────────────────────────
const generateToken = (userId = 1) =>
  jwt.sign({ userId, email: 'test@test.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

// ─── GET /api/collections ────────────────────────────────────────────────────

describe('GET /api/collections', () => {

  beforeEach(() => jest.clearAllMocks());

  test('401 — без авторизаційного заголовку', async () => {
    const res = await request(app).get('/api/collections');
    expect(res.statusCode).toBe(401);
  });

  test('200 — повертає колекції авторизованого користувача', async () => {
    collectionService.getUserCollections.mockResolvedValue([
      { id: 1, name: 'Природа',   userId: 1 },
      { id: 2, name: 'Подорожі',  userId: 1 },
    ]);

    const res = await request(app)
      .get('/api/collections')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
  });

});

// ─── POST /api/collections ───────────────────────────────────────────────────

describe('POST /api/collections', () => {

  beforeEach(() => jest.clearAllMocks());

  test('201 — створює нову колекцію', async () => {
    collectionService.createCollection.mockResolvedValue({
      id: 3, name: 'Нова колекція', userId: 1,
    });

    const res = await request(app)
      .post('/api/collections')
      .set('Authorization', `Bearer ${generateToken(1)}`)
      .send({ name: 'Нова колекція' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Нова колекція');
  });

  test('400 — назва колекції відсутня', async () => {
    const res = await request(app)
      .post('/api/collections')
      .set('Authorization', `Bearer ${generateToken(1)}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

});

// ─── PUT /api/collections/:id ────────────────────────────────────────────────

describe('PUT /api/collections/:id', () => {

  beforeEach(() => jest.clearAllMocks());

  test('200 — оновлює назву колекції', async () => {
    collectionService.updateCollection.mockResolvedValue({
      id: 1, name: 'Оновлена назва', userId: 1,
    });

    const res = await request(app)
      .put('/api/collections/1')
      .set('Authorization', `Bearer ${generateToken(1)}`)
      .send({ name: 'Оновлена назва' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Оновлена назва');
  });

  test('404 — колекція не знайдена', async () => {
    const err = new Error('Колекцію не знайдено');
    err.status = 404;
    collectionService.updateCollection.mockRejectedValue(err);

    const res = await request(app)
      .put('/api/collections/999')
      .set('Authorization', `Bearer ${generateToken(1)}`)
      .send({ name: 'Щось' });

    expect(res.statusCode).toBe(404);
  });

});

// ─── DELETE /api/collections/:id ─────────────────────────────────────────────

describe('DELETE /api/collections/:id', () => {

  beforeEach(() => jest.clearAllMocks());

  test('200 — успішно видаляє колекцію', async () => {
    collectionService.deleteCollection.mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/collections/1')
      .set('Authorization', `Bearer ${generateToken(1)}`);

    expect(res.statusCode).toBe(200);
    expect(collectionService.deleteCollection).toHaveBeenCalledWith(
      expect.anything(), 1
    );
  });

  test('401 — без авторизаційного заголовку', async () => {
    const res = await request(app).delete('/api/collections/1');
    expect(res.statusCode).toBe(401);
  });

});