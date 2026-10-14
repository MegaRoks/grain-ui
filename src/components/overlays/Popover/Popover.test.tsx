import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Popover, PopoverItem, PopoverSeparator } from './Popover';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen((o) => !o)}>Меню</button>
      <Popover open={open} onClose={() => setOpen(false)}>
        <PopoverItem>Первый</PopoverItem>
        <PopoverItem disabled>Выключен</PopoverItem>
        <PopoverItem>Последний</PopoverItem>
      </Popover>
    </div>
  );
}

describe('Popover', () => {
  it('закрытый не в DOM; открытый — data-state=open', async () => {
    const { rerender } = render(<Popover open={false}><PopoverItem>A</PopoverItem></Popover>);
    expect(screen.queryByRole('menu', { hidden: true })).not.toBeInTheDocument();
    rerender(<Popover open><PopoverItem>A</PopoverItem></Popover>);
    await waitFor(() => expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open'));
  });
  it('во время exit-перехода inert и скрыт от Tab, затем удаляется', async () => {
    const { rerender } = render(<Popover open><PopoverItem>A</PopoverItem></Popover>);
    rerender(<Popover open={false}><PopoverItem>A</PopoverItem></Popover>);
    const menu = screen.getByRole('menu', { hidden: true });
    expect(menu).toHaveAttribute('data-state', 'closed');
    expect(menu).toHaveAttribute('inert');
    await waitFor(() => expect(screen.queryByRole('menu', { hidden: true })).not.toBeInTheDocument());
  });
  it('рендерится в портал с position:fixed', () => {
    const { container } = render(<Popover open><PopoverItem>A</PopoverItem></Popover>);
    const menu = screen.getByRole('menu');
    expect(container).not.toContainElement(menu);
    expect(menu.style.position).toBe('fixed');
  });
  it('закрывается по Escape и клику снаружи, но не внутри', () => {
    const onClose = vi.fn();
    // якорь по умолчанию — родитель Popover, поэтому "снаружи" лежит вне его обёртки
    render(<div><span>снаружи</span><div><Popover open onClose={onClose}><PopoverItem>A</PopoverItem><PopoverSeparator /></Popover></div></div>);
    fireEvent.mouseDown(screen.getByRole('menuitem'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByText('снаружи'));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it('клик по триггеру переключает, а не переоткрывает', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Меню' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Меню' }));
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('data-state', 'closed');
  });
  it('клавиатура: фокус на первом, стрелки пропускают disabled, Escape возвращает фокус', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Меню' });
    await userEvent.click(trigger);
    expect(screen.getByRole('menuitem', { name: 'Первый' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Последний' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Первый' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
  it('selected-пункт помечен aria-current', () => {
    render(<Popover open><PopoverItem selected>A</PopoverItem></Popover>);
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-current', 'true');
  });
});
