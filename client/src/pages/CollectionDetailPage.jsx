import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ImageCard from '../components/ImageCard';
import api from '../services/api';

/**
 * Сторінка перегляду вмісту конкретної колекції.
 * Дозволяє переглядати, додавати та видаляти зображення з колекції.
 */
const CollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [collectionImages, setCollectionImages] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addImageId, setAddImageId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  /**
   * Завантажує дані колекції та всіх зображень користувача,
   * потім обчислює які зображення вже у колекції, а які можна додати.
   */
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [collectionsRes, imagesRes] = await Promise.all([
        api.get('/collections'),
        api.get('/images'),
      ]);

      const found = collectionsRes.data.find((c) => c.id === parseInt(id));
      if (!found) {
        navigate('/collections');
        return;
      }

      setCollection(found);

      const allImages = imagesRes.data;
      // images у колекції — масив ImageCollection { imageId, collectionId }
      const imageIdsInCollection = (found.images || []).map((ci) => ci.imageId);

      const inCollection = allImages.filter((img) =>
        imageIdsInCollection.includes(img.id)
      );
      const notInCollection = allImages.filter(
        (img) => !imageIdsInCollection.includes(img.id)
      );

      setCollectionImages(inCollection);
      setAvailableImages(notInCollection);
    } catch {
      setError('Помилка завантаження даних');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Видаляє зображення з колекції (не видаляє саме зображення).
   * @param {number} imageId
   */
  const handleRemoveImage = async (imageId) => {
    setError('');
    try {
      await api.delete(`/collections/${id}/images/${imageId}`);
      await fetchData();
    } catch {
      setError('Помилка видалення зображення з колекції');
    }
  };

  /**
   * Додає обране зображення до поточної колекції.
   * @param {React.FormEvent} e
   */
  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!addImageId) return;
    setError('');
    try {
      await api.post(`/collections/${id}/images`, {
        imageId: parseInt(addImageId),
      });
      setAddImageId('');
      await fetchData();
    } catch {
      setError('Помилка додавання зображення до колекції');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-sm text-gray-400">Завантаження...</p>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/collections')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Колекції
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {collection?.name}
              </h1>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded mb-4">
                {error}
              </p>
            )}

            {/* Форма додавання зображення до колекції */}
            {availableImages.length > 0 && (
              <form onSubmit={handleAddImage} className="flex gap-2 mb-6">
                <select
                  value={addImageId}
                  onChange={(e) => setAddImageId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                >
                  <option value="">Оберіть зображення для додавання</option>
                  {availableImages.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.originalName}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Додати
                </button>
              </form>
            )}

            {collectionImages.length === 0 ? (
              <p className="text-sm text-gray-400">
                Колекція порожня. Додайте зображення!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {collectionImages.map((img) => (
                  <ImageCard
                    key={img.id}
                    image={img}
                    onDelete={handleRemoveImage}
                    onClick={setSelectedImage}
                  />
                ))}
              </div>
            )}
          </>
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

export default CollectionDetailPage;
