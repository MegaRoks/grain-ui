import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from './Tag';

describe('Tag', () => {
  it('без onRemove нет кнопки', () => {
    render(<Tag>main</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('onRemove вызывается по клику на крестик', async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove} removeLabel="Убрать main">main</Tag>);
    await userEvent.click(screen.getByRole('button', { name: 'Убрать main' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
