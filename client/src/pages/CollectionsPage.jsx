import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CollectionCard from '../components/CollectionCard';
import api from '../services/api';

/**
 * Сторінка управління колекціями зображень.
 * Дозволяє створювати, перейменовувати та видаляти колекції.
 */
const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState('');
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  /** Завантажує список колекцій поточного користувача */
  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/collections');
      setCollections(data);
    } catch {
      setError('Помилка завантаження колекцій');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Створює нову колекцію з введеною назвою.
   * @param {React.FormEvent} e
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    try {
      await api.post('/collections', { name: newName.trim() });
      setNewName('');
      await fetchCollections();
    } catch {
      setError('Помилка створення колекції');
    }
  };

  /**
   * Видаляє колекцію за ідентифікатором.
   * @param {number} id
   */
  const handleDelete = async (id) => {
    setError('');
    try {
      await api.delete(`/collections/${id}`);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Помилка видалення колекції');
    }
  };

  /** Відкриває модальне вікно перейменування для обраної колекції */
  const handleRename = (collection) => {
    setRenameTarget(collection);
    setRenameValue(collection.name);
  };

  /**
   * Зберігає нову назву колекції на сервері.
   * @param {React.FormEvent} e
   */
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    setError('');
    try {
      await api.put(`/collections/${renameTarget.id}`, {
        name: renameValue.trim(),
      });
      setRenameTarget(null);
      await fetchCollections();
    } catch {
      setError('Помилка перейменування колекції');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Колекції</h1>

        {/* Форма створення нової колекції */}
        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Назва нової колекції"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Створити
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-gray-400">Завантаження...</p>
        ) : collections.length === 0 ? (
          <p className="text-sm text-gray-400">
            Ще немає колекцій. Створіть першу!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {collections.map((c) => (
              <CollectionCard
                key={c.id}
                collection={c}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </div>

      {/* Модальне вікно перейменування колекції */}
      {renameTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Перейменувати колекцію
            </h2>
            <form onSubmit={handleRenameSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
