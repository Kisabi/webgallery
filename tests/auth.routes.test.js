// tests/auth.routes.test.js
// Інтеграційні тести маршрутів src/routes/auth.js
// app.js знаходиться в корені проєкту.

const request = require('supertest');
const app     = require('../app');      // корінь проєкту

// Мок сервісу — шлях до src/services/authService.js
jest.mock('../src/services/authService', () => ({
  register: jest.fn(),
  login:    jest.fn(),
}));

const authService = require('../src/services/authService');

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe('POST /api/auth/register', () => {

  beforeEach(() => jest.clearAllMocks());

  test('201 — успішна реєстрація', async () => {
    authService.register.mockResolvedValue({
      id: 1, email: 'new@test.com', username: 'newuser',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.com', username: 'newuser', password: 'password123' });

    expect(res.statusCode).toBe(201);
    // Сервер повертає { message: "...", user: { email, id, username } }
    expect(res.body.user).toHaveProperty('email', 'new@test.com');
  });

  test('409 — email вже зайнятий', async () => {
    const err = new Error('Користувач вже існує');
    err.status = 409;
    authService.register.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'taken@test.com', username: 'user', password: '123456' });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  test('400 — відсутнє обов\'язкове поле', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.com' }); // немає username і password

    expect(res.statusCode).toBe(400);
  });

});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {

  beforeEach(() => jest.clearAllMocks());

  test('200 — повертає JWT-токен', async () => {
    authService.login.mockResolvedValue('mocked.jwt.token');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'correct_pass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'mocked.jwt.token');
  });

  test('401 — невірний пароль', async () => {
    const err = new Error('Невірний email або пароль');
    err.status = 401;
    authService.login.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'wrong_pass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

});