import { useState } from 'react';

/**
 * Компонент форми завантаження нового зображення на сервер.
 * @param {{ onUpload: Function, loading: boolean }} props
 * @param {Function} props.onUpload  - callback з об'єктом File для завантаження
 * @param {boolean}  props.loading   - стан завантаження (блокує кнопку)
 */
const ImageUploadForm = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Оберіть файл для завантаження');
      return;
    }
    setError('');
    onUpload(file);
    setFile(null);
    e.target.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-4"
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="ml-auto px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Завантаження...' : 'Завантажити'}
      </button>
    </form>
  );
};

export default ImageUploadForm;
