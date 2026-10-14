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
  it('работает без контроля', async () => {
    render(<RadioGroup label="Н">{['x', 'y'].map((v) => <Radio key={v} name="n" value={v} label={v} defaultChecked={v === 'x'} />)}</RadioGroup>);
    await userEvent.click(screen.getByLabelText('y'));
    expect(screen.getByLabelText('y')).toBeChecked();
    expect(screen.getByLabelText('x')).not.toBeChecked();
  });
});
