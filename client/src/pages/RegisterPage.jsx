import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Сторінка реєстрації нового облікового запису.
 * Після успішної реєстрації автоматично виконує вхід.
 */
const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      // Автоматичний вхід після успішної реєстрації
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка реєстрації. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Реєстрація</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="user@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Ім'я користувача
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="username"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Пароль</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Вже є акаунт?{' '}
          <Link to="/login" className="text-gray-800 underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
