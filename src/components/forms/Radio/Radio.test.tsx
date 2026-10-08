import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

function Harness() {
  const [v, setV] = useState('a');
  return (
    <RadioGroup label="Группа">
      {['a', 'b'].map((x) => <Radio key={x} name="g" value={x} label={x.toUpperCase()} checked={v === x} onChange={() => setV(x)} />)}
    </RadioGroup>
  );
}

describe('Radio', () => {
  it('группа имеет имя и выбирает одно значение', async () => {
    render(<Harness />);
    expect(screen.getByRole('radiogroup', { name: 'Группа' })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('B'));
    expect(screen.getByLabelText('B')).toBeChecked();
    expect(screen.getByLabelText('A')).not.toBeChecked();
  });
});
