// tests/auth.middleware.test.js
// Юніт-тести для src/middleware/auth.js
// Тестуємо функцію authMiddleware в повній ізоляції —
// без HTTP-сервера і без бази даних.

const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret_key';

// Шлях відповідає реальній структурі: src/middleware/auth.js
const authMiddleware = require('../src/middleware/auth');

// ─── Допоміжні функції ───────────────────────────────────────────────────────

const mockRequest = (authHeader = null) => ({
  headers: { authorization: authHeader },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// ─── Тести ───────────────────────────────────────────────────────────────────

describe('authMiddleware — src/middleware/auth.js', () => {

  beforeEach(() => mockNext.mockClear());

  test('401 — заголовок Authorization відсутній', () => {
    const req = mockRequest(null);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('401 — заголовок без префіксу "Bearer "', () => {
    const req = mockRequest('justtoken123');
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('401 — токен підписаний неправильним ключем', () => {
    const badToken = jwt.sign({ userId: 1 }, 'wrong_secret');
    const req      = mockRequest(`Bearer ${badToken}`);
    const res      = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('401 — токен прострочений', () => {
    const expiredToken = jwt.sign(
      { userId: 1, email: 'test@test.com' },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );
    const req = mockRequest(`Bearer ${expiredToken}`);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('next() викликається і req.user заповнений при валідному токені', () => {
    const payload    = { userId: 42, email: 'user@test.com' };
    const validToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const req        = mockRequest(`Bearer ${validToken}`);
    const res        = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe(42);
    expect(req.user.email).toBe('user@test.com');
  });

});