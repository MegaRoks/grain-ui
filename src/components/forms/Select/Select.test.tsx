import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  it('рендерит строки и пары как option', () => {
    render(<Select label="R" options={['a', { value: 'b', label: 'Бэ' }]} />);
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Бэ' })).toHaveValue('b');
  });
  it('выбирает значение', async () => {
    const onChange = vi.fn();
    render(<Select label="R" options={['a', 'b']} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('R'), 'b');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText('R')).toHaveValue('b');
  });
});
