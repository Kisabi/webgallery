// tests/auth.service.test.js
// Юніт-тести для src/services/authService.js
// Мокуємо userRepository і bcrypt — тестуємо лише бізнес-логіку.

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret_key';

// Мок репозиторію — шлях відповідає src/repositories/userRepository.js
jest.mock('../src/repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  create:      jest.fn(),
}));

// Мок bcrypt — щоб не витрачати час на реальне хешування
jest.mock('bcrypt');

const userRepository = require('../src/repositories/userRepository');
const authService    = require('../src/services/authService');

// ─── authService.register ────────────────────────────────────────────────────

describe('authService.register', () => {

  beforeEach(() => jest.clearAllMocks());

  test('створює користувача і повертає його дані', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password_xyz');
    userRepository.create.mockResolvedValue({
      id: 1, email: 'new@test.com', username: 'newuser',
    });

    const result = await authService.register('new@test.com', 'newuser', 'password123');

    expect(userRepository.findByEmail).toHaveBeenCalledWith('new@test.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      email:        'new@test.com',
      username:     'newuser',
      passwordHash: 'hashed_password_xyz',
    });
    expect(result.email).toBe('new@test.com');
  });

  test('кидає помилку 409, якщо email вже зайнятий', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'taken@test.com' });

    await expect(
      authService.register('taken@test.com', 'someuser', 'password123')
    ).rejects.toMatchObject({ status: 409 });

    expect(userRepository.create).not.toHaveBeenCalled();
  });

});

// ─── authService.login ───────────────────────────────────────────────────────

describe('authService.login', () => {

  beforeEach(() => jest.clearAllMocks());

  test('повертає JWT-токен при правильних даних', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 1, email: 'user@test.com', passwordHash: 'hashed_pass',
    });
    bcrypt.compare.mockResolvedValue(true);

    const token   = await authService.login('user@test.com', 'correct_password');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(token).toBeDefined();
    expect(decoded.userId).toBe(1);
    expect(decoded.email).toBe('user@test.com');
  });

  test('кидає помилку 401, якщо email не існує', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login('noone@test.com', 'any_password')
    ).rejects.toMatchObject({ status: 401 });
  });

  test('кидає помилку 401, якщо пароль невірний', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 1, email: 'user@test.com', passwordHash: 'hashed_pass',
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login('user@test.com', 'wrong_password')
    ).rejects.toMatchObject({ status: 401 });
  });

});