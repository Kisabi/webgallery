import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Тестовий компонент для перевірки контексту
const TestComponent = () => {
  const { token, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="token">{token || 'null'}</span>
      <button onClick={() => login('test-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('початковий токен є null якщо localStorage порожній', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('token').textContent).toBe('null');
  });

  test('login зберігає токен у стані та localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('token').textContent).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('logout видаляє токен зі стану та localStorage', () => {
    localStorage.setItem('token', 'existing-token');
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('початковий токен зчитується з localStorage', () => {
    localStorage.setItem('token', 'stored-token');
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('token').textContent).toBe('stored-token');
  });
});
