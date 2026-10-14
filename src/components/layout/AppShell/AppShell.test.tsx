import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

const setMobile = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches, media: q, addEventListener: vi.fn(), removeEventListener: vi.fn() })) as unknown as typeof window.matchMedia;
};

describe('AppShell', () => {
  it('рендерит main, шапку и skip-ссылку на main', () => {
    setMobile(false);
    render(<AppShell sidebar={<nav aria-label="Нав" />} header="Проекты">Контент</AppShell>);
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('Контент');
    expect(screen.getByRole('banner')).toHaveTextContent('Проекты');
    expect(screen.getByRole('link', { name: 'К содержимому' })).toHaveAttribute('href', '#' + main.id);
  });
  it('на мобильном закрытая панель inert, открытая — модальный диалог', () => {
    setMobile(true);
    const { rerender, container } = render(<AppShell sidebar={<button>Пункт</button>}>x</AppShell>);
    expect(container.querySelector('.gr-shell__sidebar')).toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: 'Открыть меню' })).toHaveAttribute('aria-expanded', 'false');
    rerender(<AppShell sidebar={<button>Пункт</button>} sidebarOpen>x</AppShell>);
    expect(screen.getByRole('dialog', { name: 'Навигация' })).toHaveAttribute('aria-modal', 'true');
  });
});
