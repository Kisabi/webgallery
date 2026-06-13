import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>
  );

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    mockNavigate.mockClear();
  });

  test('відображає посилання на галерею та колекції', () => {
    renderNavbar();
    expect(screen.getByText('Галерея')).toBeInTheDocument();
    expect(screen.getByText('Колекції')).toBeInTheDocument();
  });

  test('відображає кнопку виходу', () => {
    renderNavbar();
    expect(screen.getByText('Вийти')).toBeInTheDocument();
  });

  test('натискання Вийти видаляє токен та перенаправляє', () => {
    renderNavbar();
    fireEvent.click(screen.getByText('Вийти'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
