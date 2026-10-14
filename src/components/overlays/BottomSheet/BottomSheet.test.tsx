import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Фильтры</button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Период" footer={<button>Применить</button>}>
        <button>Неделя</button>
      </BottomSheet>
    </>
  );
}

const sheet = () => screen.getByRole('dialog');
const grab = () => sheet().querySelector('.gr-sheet__grab')!;
const drag = (dy: number, dt: number) => {
  Object.defineProperty(sheet(), 'offsetHeight', { configurable: true, value: 400 });
  vi.useFakeTimers();
  fireEvent.pointerDown(grab(), { button: 0, clientY: 100, pointerId: 1 });
  vi.advanceTimersByTime(dt);
  fireEvent.pointerMove(grab(), { clientY: 100 + dy, pointerId: 1 });
  vi.useRealTimers();
  fireEvent.pointerUp(grab(), { pointerId: 1 });
};

describe('BottomSheet', () => {
  it('модальный диалог с заголовком, в портале', () => {
    const { container } = render(<BottomSheet open title="Период">x</BottomSheet>);
    expect(screen.getByRole('dialog', { name: 'Период' })).toHaveAttribute('aria-modal', 'true');
    expect(container).not.toContainElement(sheet());
  });
  it('держит фокус и возвращает его на триггер по Escape', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Фильтры' });
    await userEvent.click(trigger);
    expect(sheet()).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Неделя' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
  it('закрывается по scrim', async () => {
    const onClose = vi.fn();
    render(<BottomSheet open onClose={onClose} title="T" />);
    await userEvent.click(screen.getByTestId('scrim'));
    expect(onClose).toHaveBeenCalled();
  });
  it('смахивание дальше 30% высоты закрывает, короткое — нет', () => {
    const onClose = vi.fn();
    render(<BottomSheet open onClose={onClose} title="T" />);
    drag(60, 400);
    expect(onClose).not.toHaveBeenCalled();
    expect(sheet().style.transform).toBe('');
    drag(160, 400);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it('резкий рывок закрывает даже на короткой дистанции', () => {
    const onClose = vi.fn();
    render(<BottomSheet open onClose={onClose} title="T" />);
    drag(50, 40);
    expect(onClose).toHaveBeenCalled();
  });
  it('без onClose не смахивается', () => {
    render(<BottomSheet open title="T" />);
    fireEvent.pointerDown(grab(), { button: 0, clientY: 0 });
    expect(sheet()).not.toHaveAttribute('data-dragging');
  });
});
