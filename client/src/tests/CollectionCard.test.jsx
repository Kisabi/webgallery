import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CollectionCard from '../components/CollectionCard';

const mockCollection = { id: 1, name: 'Моя колекція' };

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <CollectionCard
        collection={mockCollection}
        onDelete={jest.fn()}
        onRename={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe('CollectionCard', () => {
  test('відображає назву колекції', () => {
    renderCard();
    expect(screen.getByText('Моя колекція')).toBeInTheDocument();
  });

  test('відображає кнопки Перейменувати та Видалити', () => {
    renderCard();
    expect(screen.getByText('Перейменувати')).toBeInTheDocument();
    expect(screen.getByText('Видалити')).toBeInTheDocument();
  });

  test('викликає onDelete з id при натисканні Видалити', () => {
    const onDelete = jest.fn();
    renderCard({ onDelete });
    fireEvent.click(screen.getByText('Видалити'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('викликає onRename з об\'єктом колекції при натисканні Перейменувати', () => {
    const onRename = jest.fn();
    renderCard({ onRename });
    fireEvent.click(screen.getByText('Перейменувати'));
    expect(onRename).toHaveBeenCalledWith(mockCollection);
  });

  test('посилання веде на правильний маршрут колекції', () => {
    renderCard();
    const link = screen.getByText('Моя колекція').closest('a');
    expect(link).toHaveAttribute('href', '/collections/1');
  });
});
