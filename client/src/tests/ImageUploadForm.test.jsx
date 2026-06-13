import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploadForm from '../components/ImageUploadForm';

describe('ImageUploadForm', () => {
  test('відображає кнопку завантаження', () => {
    render(<ImageUploadForm onUpload={jest.fn()} loading={false} />);
    expect(screen.getByText('Завантажити')).toBeInTheDocument();
  });

  test('показує "Завантаження..." коли loading=true', () => {
    render(<ImageUploadForm onUpload={jest.fn()} loading={true} />);
    expect(screen.getByText('Завантаження...')).toBeInTheDocument();
  });

  test('кнопка заблокована коли loading=true', () => {
    render(<ImageUploadForm onUpload={jest.fn()} loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('показує помилку якщо форма відправлена без файлу', () => {
    render(<ImageUploadForm onUpload={jest.fn()} loading={false} />);
    fireEvent.click(screen.getByText('Завантажити'));
    expect(
      screen.getByText('Оберіть файл для завантаження')
    ).toBeInTheDocument();
  });

  test('не викликає onUpload якщо файл не обрано', () => {
    const onUpload = jest.fn();
    render(<ImageUploadForm onUpload={onUpload} loading={false} />);
    fireEvent.click(screen.getByText('Завантажити'));
    expect(onUpload).not.toHaveBeenCalled();
  });
});
