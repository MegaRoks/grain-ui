import { render, screen, fireEvent } from '@testing-library/react';
import { Popover, PopoverItem, PopoverSeparator } from './Popover';

describe('Popover', () => {
  it('отражает состояние в data-state', () => {
    const { rerender } = render(<Popover open={false}><PopoverItem>A</PopoverItem></Popover>);
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('data-state', 'closed');
    rerender(<Popover open><PopoverItem>A</PopoverItem></Popover>);
    expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open');
  });
  it('закрывается по Escape и клику снаружи, но не внутри', () => {
    const onClose = vi.fn();
    render(<div><span>снаружи</span><Popover open onClose={onClose}><PopoverItem>A</PopoverItem><PopoverSeparator /></Popover></div>);
    fireEvent.mouseDown(screen.getByRole('menuitem'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByText('снаружи'));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it('selected-пункт помечен aria-current', () => {
    render(<Popover open><PopoverItem selected>A</PopoverItem></Popover>);
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-current', 'true');
  });
});
