import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

function Harness() {
  const [on, setOn] = useState(false);
  return <Checkbox label="Опция" checked={on} onChange={(e) => setOn(e.target.checked)} />;
}

describe('Checkbox', () => {
  it('переключается кликом по лейблу', async () => {
    render(<Harness />);
    const box = screen.getByRole('checkbox', { name: 'Опция' });
    expect(box).not.toBeChecked();
    await userEvent.click(screen.getByText('Опция'));
    expect(box).toBeChecked();
  });
  it('работает без контроля (defaultChecked и без пропа)', async () => {
    render(<><Checkbox label="Один" defaultChecked /><Checkbox label="Два" /></>);
    const one = screen.getByRole('checkbox', { name: 'Один' });
    const two = screen.getByRole('checkbox', { name: 'Два' });
    expect(one).toBeChecked();
    await userEvent.click(two);
    expect(two).toBeChecked();
  });
  it('disabled не переключается', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="X" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
