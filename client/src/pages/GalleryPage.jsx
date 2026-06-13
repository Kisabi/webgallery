import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ImageCard from '../components/ImageCard';
import ImageUploadForm from '../components/ImageUploadForm';
import api from '../services/api';

/**
 * Сторінка галереї зображень.
 * Відображає всі завантажені зображення авторизованого користувача,
 * надає можливість завантажувати нові та видаляти наявні.
 */
const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  /** Завантажує список зображень поточного користувача з сервера */
  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/images');
      setImages(data);
    } catch {
      setError('Помилка завантаження зображень');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Відправляє файл зображення на сервер через multipart/form-data.
   * @param {File} file - об'єкт файлу для завантаження
   */
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setError('');
    try {
      await api.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchImages();
    } catch {
      setError('Помилка завантаження файлу. Перевірте формат та розмір (макс. 5 МБ).');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Видаляє зображення за ідентифікатором.
   * @param {number} id - ідентифікатор зображення
   */
  const handleDelete = async (id) => {
    setError('');
    try {
      await api.delete(`/images/${id}`);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      setError('Помилка видалення зображення');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Моя галерея</h1>

        <div className="mb-6">
          <ImageUploadForm onUpload={handleUpload} loading={uploading} />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-gray-400">Завантаження...</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-gray-400">
            Ще немає зображень. Завантажте перше!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                onDelete={handleDelete}
                onClick={setSelectedImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox для перегляду зображення у повному розмірі */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`http://localhost:3000/uploads/${selectedImage.filename}`}
            alt={selectedImage.originalName}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
