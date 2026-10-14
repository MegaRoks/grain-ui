import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { BottomNav, type BottomNavItem } from './BottomNav';

const items: BottomNavItem[] = [
  { value: 'home', label: 'Главная', icon: 'check' },
  { value: 'stats', label: 'Статистика', icon: 'info', badge: true },
  { value: 'inbox', label: 'Входящие', icon: 'x', badge: 120 },
];

function Harness() {
  const [v, setV] = useState('home');
  return <BottomNav items={items} value={v} onChange={setV} />;
}

describe('BottomNav', () => {
  it('навигация с текущим разделом', () => {
    render(<Harness />);
    expect(screen.getByRole('navigation', { name: 'Разделы' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Главная' })).toHaveAttribute('aria-current', 'page');
  });
  it('нажатие переключает раздел', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: /Статистика/ }));
    expect(screen.getByRole('button', { name: /Статистика/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Главная' })).not.toHaveAttribute('aria-current');
  });
  it('бейджи: точка и счётчик с переполнением, озвучены', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: /^Статистика ?, есть новое$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Входящие ?, 120 новых$/ })).toHaveTextContent('99+');
  });
  it('с href — ссылки', () => {
    render(<BottomNav items={[{ value: 'a', label: 'А', icon: 'x', href: '/a' }]} value="a" />);
    expect(screen.getByRole('link', { name: 'А' })).toHaveAttribute('href', '/a');
  });
});
