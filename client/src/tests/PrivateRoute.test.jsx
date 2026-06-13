import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from '../components/PrivateRoute';

const ProtectedPage = () => <div>Захищена сторінка</div>;
const LoginPage = () => <div>Сторінка входу</div>;

const renderWithRouter = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => localStorage.clear());

  test('відображає захищений контент якщо токен присутній', () => {
    renderWithRouter('valid-token');
    expect(screen.getByText('Захищена сторінка')).toBeInTheDocument();
  });

  test('перенаправляє на /login якщо токен відсутній', () => {
    renderWithRouter(null);
    expect(screen.getByText('Сторінка входу')).toBeInTheDocument();
  });
});
