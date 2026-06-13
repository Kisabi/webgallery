import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Компонент навігаційної панелі.
 * Відображається на всіх авторизованих сторінках застосунку.
 */
const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /** Виконує вихід з облікового запису та перенаправляє на сторінку входу */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-gray-800">
            WebGallery
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Галерея
          </Link>
          <Link
            to="/collections"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Колекції
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Вийти
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
