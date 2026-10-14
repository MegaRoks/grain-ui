import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Dialog } from './Dialog';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Открыть</button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Удалить проект" footer={<><button>Отмена</button><button>Удалить</button></>} />
    </div>
  );
}

describe('Dialog', () => {
  it('закрыт — ничего не рендерит', () => {
    render(<Dialog open={false} title="T" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('открыт — доступен по заголовку и описанию, рендерится в body', () => {
    const { container } = render(<Dialog open title="Заголовок" description="Описание">Тело</Dialog>);
    const dlg = screen.getByRole('dialog', { name: 'Заголовок' });
    expect(dlg).toHaveAttribute('aria-modal', 'true');
    expect(dlg).toHaveAccessibleDescription('Описание');
    expect(container).not.toContainElement(dlg);
  });
  it('inline рендерится на месте', () => {
    const { container } = render(<Dialog open inline title="T" />);
    expect(container).toContainElement(screen.getByRole('dialog'));
  });
  it('закрывается по Escape, крестику и scrim', async () => {
    const onClose = vi.fn();
    render(<Dialog open title="T" onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    await userEvent.click(screen.getByTestId('scrim'));
    expect(onClose).toHaveBeenCalledTimes(3);
  });
  it('без onClose нет крестика', () => {
    render(<Dialog open title="T" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('держит фокус внутри и возвращает его на триггер', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });
    await userEvent.click(trigger);
    const dlg = screen.getByRole('dialog');
    expect(dlg).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Удалить' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Удалить' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
  it('блокирует прокрутку body, пока открыт', () => {
    const { rerender } = render(<Dialog open title="T" />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Dialog open={false} title="T" />);
    expect(document.body.style.overflow).toBe('');
  });
  it('Escape закрывает только верхний из вложенных', () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(<Dialog open title="A" onClose={outer}><Dialog open title="B" onClose={inner} /></Dialog>);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });
});
