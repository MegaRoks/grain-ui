import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Tabs } from './Tabs';

function Harness({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState('a');
  return <Tabs items={['a', 'b', 'c']} value={v} onChange={(x) => { setV(x); onChange?.(x); }} />;
}

describe('Tabs', () => {
  it('первая вкладка выбрана по умолчанию', () => {
    render(<Tabs items={['a', 'b']} />);
    expect(screen.getByRole('tab', { name: 'a' })).toHaveAttribute('aria-selected', 'true');
  });
  it('клик меняет выбор', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'b' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: 'b' })).toHaveAttribute('aria-selected', 'true');
  });
  it('стрелки переключают по кругу', async () => {
    render(<Harness />);
    screen.getByRole('tab', { name: 'a' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'c' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'c' })).toHaveFocus();
  });
});
