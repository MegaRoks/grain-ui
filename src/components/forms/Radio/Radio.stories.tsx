import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Forms/Radio',
  component: Radio,
  subcomponents: { RadioGroup },
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  render: () => {
    const [v, setV] = useState('preview');
    const opts = [
      { value: 'preview', label: 'Превью', description: 'Для каждой ветки' },
      { value: 'production', label: 'Production', description: 'Только main' },
    ];
    return (
      <RadioGroup label="Окружение">
        {opts.map((o) => (
          <Radio key={o.value} name="env" value={o.value} label={o.label} description={o.description} checked={v === o.value} onChange={() => setV(o.value)} />
        ))}
      </RadioGroup>
    );
  },
};
