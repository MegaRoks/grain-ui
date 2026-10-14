import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Tabs, TabPanel } from './Tabs';

function Harness({ onChange }: { onChange?: (v: string) => void }) {
  const [v, setV] = useState('a');
  return <Tabs items={['a', 'b', 'c']} value={v} onChange={(x) => { setV(x); onChange?.(x); }} />;
}

function WithPanels() {
  const [v, setV] = useState('Обзор');
  return (
    <>
      <Tabs id="proj" aria-label="Проект" items={['Обзор', 'Логи']} value={v} onChange={setV} />
      <TabPanel tabsId="proj" value="Обзор" hidden={v !== 'Обзор'}>Сводка</TabPanel>
      <TabPanel tabsId="proj" value="Логи" hidden={v !== 'Логи'}>Строки логов</TabPanel>
    </>
  );
}

describe('Tabs', () => {
  it('первая вкладка выбрана по умолчанию', () => {
    render(<Tabs items={['a', 'b']} />);
    expect(screen.getByRole('tab', { name: 'a' })).toHaveAttribute('aria-selected', 'true');
  });
  it('неконтролируемый режим переключается сам', async () => {
    render(<Tabs items={['a', 'b']} defaultValue="b" />);
    expect(screen.getByRole('tab', { name: 'b' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'a' }));
    expect(screen.getByRole('tab', { name: 'a' })).toHaveAttribute('aria-selected', 'true');
  });
  it('клик меняет выбор', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'b' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: 'b' })).toHaveAttribute('aria-selected', 'true');
  });
  it('стрелки переключают по кругу, Home/End — к краям', async () => {
    render(<Harness />);
    screen.getByRole('tab', { name: 'a' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'c' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'c' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'a' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'c' })).toHaveFocus();
  });
  it('пропускает disabled-вкладки', async () => {
    render(<Tabs items={['a', { value: 'b', label: 'b', disabled: true }, 'c']} />);
    screen.getByRole('tab', { name: 'a' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'c' })).toHaveFocus();
  });
  it('связывает вкладки с панелями', async () => {
    render(<WithPanels />);
    const tab = screen.getByRole('tab', { name: 'Логи' });
    const panel = screen.getByText('Строки логов');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel).not.toBeVisible();
    await userEvent.click(tab);
    expect(screen.getByRole('tabpanel', { name: 'Логи' })).toBeVisible();
  });
});
