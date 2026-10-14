import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar, SidebarSection, NavItem } from './Sidebar';

describe('Sidebar', () => {
  it('навигация с именем, секции — именованные списки', () => {
    render(
      <Sidebar label="Проект">
        <SidebarSection label="Обзор">
          <NavItem href="/" active>Дашборд</NavItem>
          <NavItem href="/deploys" count={12}>Деплои</NavItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByRole('navigation', { name: 'Проект' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Обзор' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Дашборд' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Деплои/ })).not.toHaveAttribute('aria-current');
  });
  it('без href — кнопка с onClick', async () => {
    const onClick = vi.fn();
    render(<Sidebar><SidebarSection><NavItem onClick={onClick}>Поиск</NavItem></SidebarSection></Sidebar>);
    await userEvent.click(screen.getByRole('button', { name: 'Поиск' }));
    expect(onClick).toHaveBeenCalled();
  });
});
