import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Switch } from './Switch';

function Harness() {
  const [on, setOn] = useState(false);
  return <Switch label="Тумблер" checked={on} onChange={(e) => setOn(e.target.checked)} />;
}

describe('Switch', () => {
  it('имеет роль switch и переключается', async () => {
    render(<Harness />);
    const sw = screen.getByRole('switch', { name: 'Тумблер' });
    await userEvent.click(sw);
    expect(sw).toBeChecked();
    expect(sw.closest('label')).toHaveClass('gr-switch--on');
  });
});
