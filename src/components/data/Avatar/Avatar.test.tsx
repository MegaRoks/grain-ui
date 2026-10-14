import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar, AvatarGroup, initials } from './Avatar';

describe('Avatar', () => {
  it('инициалы из имени', () => {
    expect(initials('Анна Петрова')).toBe('АП');
    expect(initials('grain')).toBe('G');
    expect(initials('  ')).toBe('?');
  });
  it('доступен по имени, без src — инициалы', () => {
    render(<Avatar name="Анна Петрова" />);
    expect(screen.getByRole('img', { name: 'Анна Петрова' })).toHaveTextContent('АП');
  });
  it('при ошибке загрузки откатывается на инициалы', () => {
    const { container } = render(<Avatar name="Иван" src="/broken.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Иван' })).toHaveTextContent('И');
  });
  it('AvatarGroup сворачивает лишние в +N', () => {
    render(<AvatarGroup max={2}>{['А Б', 'В Г', 'Д Е', 'Ж З'].map((n) => <Avatar key={n} name={n} />)}</AvatarGroup>);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByLabelText('Ещё 2')).toHaveTextContent('+2');
  });
});
