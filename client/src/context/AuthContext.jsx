import { createContext, useContext, useState } from 'react';

/** @type {React.Context} Контекст авторизації застосунку */
const AuthContext = createContext(null);

/**
 * Провайдер контексту авторизації.
 * Виконує роль DI-контейнера: надає token, login та logout
 * усьому дереву компонентів без явної передачі через пропси.
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  /**
   * Зберігає JWT-токен у стані компонента та localStorage.
   * @param {string} newToken - JWT-токен отриманий від сервера
   */
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  /**
   * Видаляє JWT-токен зі стану компонента та localStorage.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Хук для доступу до контексту авторизації з будь-якого компонента.
 * @returns {{ token: string|null, login: Function, logout: Function }}
 */
export const useAuth = () => useContext(AuthContext);
