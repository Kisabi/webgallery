import { render, screen, fireEvent } from '@testing-library/react';
import ImageCard from '../components/ImageCard';

const mockImage = {
  id: 1,
  filename: 'test-image.jpg',
  originalName: 'test-image.jpg',
};

describe('ImageCard', () => {
  test('відображає зображення з коректним src', () => {
    render(<ImageCard image={mockImage} />);
    const img = screen.getByAltText('test-image.jpg');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('test-image.jpg');
  });

  test('відображає назву зображення', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
  });

  test('відображає кнопку видалення якщо передано onDelete', () => {
    render(<ImageCard image={mockImage} onDelete={jest.fn()} />);
    expect(screen.getByText('Видалити')).toBeInTheDocument();
  });

  test('не відображає кнопку видалення якщо onDelete не передано', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.queryByText('Видалити')).not.toBeInTheDocument();
  });

  test('викликає onDelete з id зображення при натисканні', () => {
    const onDelete = jest.fn();
    render(<ImageCard image={mockImage} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Видалити'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('викликає onClick з об\'єктом зображення при кліку на фото', () => {
    const onClick = jest.fn();
    render(<ImageCard image={mockImage} onClick={onClick} />);
    fireEvent.click(screen.getByAltText('test-image.jpg'));
    expect(onClick).toHaveBeenCalledWith(mockImage);
  });
});
