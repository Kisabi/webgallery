/**
 * Компонент картки зображення у сітці галереї.
 * @param {{ image: Object, onDelete: Function|undefined, onClick: Function|undefined }} props
 * @param {Object}   props.image          - об'єкт зображення з сервера
 * @param {Function} [props.onDelete]     - callback видалення (передається id)
 * @param {Function} [props.onClick]      - callback відкриття у повний розмір
 */
const ImageCard = ({ image, onDelete, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
      <div
        className="aspect-square overflow-hidden cursor-pointer"
        onClick={() => onClick && onClick(image)}
      >
        <img
          src={`http://localhost:3000/uploads/${image.filename}`}
          alt={image.originalName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-2 flex items-center justify-between">
        <p className="text-xs text-gray-500 truncate max-w-[140px]">
          {image.originalName}
        </p>
        {onDelete && (
          <button
            onClick={() => onDelete(image.id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors ml-2 shrink-0"
          >
            Видалити
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
