import { Link } from 'react-router-dom';

/**
 * Компонент картки колекції у списку колекцій.
 * @param {{ collection: Object, onDelete: Function, onRename: Function }} props
 * @param {Object}   props.collection  - об'єкт колекції з сервера
 * @param {Function} props.onDelete    - callback видалення (передається id)
 * @param {Function} props.onRename    - callback перейменування (передається об'єкт колекції)
 */
const CollectionCard = ({ collection, onDelete, onRename }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
      <Link
        to={`/collections/${collection.id}`}
        className="text-gray-800 font-medium hover:text-gray-600 transition-colors"
      >
        {collection.name}
      </Link>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onRename(collection)}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Перейменувати
        </button>
        <button
          onClick={() => onDelete(collection.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Видалити
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;
