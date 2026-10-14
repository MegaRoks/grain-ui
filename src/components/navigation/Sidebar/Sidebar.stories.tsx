import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar, SidebarSection, NavItem } from './Sidebar';
import { Avatar } from '../../data/Avatar';
import { Badge } from '../../core/Badge';

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  subcomponents: { SidebarSection, NavItem },
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [page, setPage] = useState('overview');
    const item = (id: string, label: string, icon: string, extra?: object) => (
      <NavItem icon={icon} active={page === id} onClick={() => setPage(id)} {...extra}>{label}</NavItem>
    );
    return (
      <div style={{ height: 560 }}>
        <Sidebar
          header={<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14, padding: '4px 8px' }}><Avatar name="Grain" shape="square" size="sm" />grain-web</div>}
          footer={<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><Avatar name="Анна Петрова" size="sm" status="online" />Анна Петрова</div>}
        >
          <SidebarSection>
            {item('overview', 'Обзор', 'layout-dashboard')}
            {item('deploys', 'Деплои', 'rocket', { count: 128 })}
            {item('logs', 'Логи', 'scroll-text')}
            {item('analytics', 'Аналитика', 'chart-line', { trailing: <Badge tone="accent">Новое</Badge> })}
          </SidebarSection>
          <SidebarSection label="Настройки">
            {item('domains', 'Домены', 'globe')}
            {item('env', 'Переменные', 'key-round')}
            {item('team', 'Команда', 'users')}
          </SidebarSection>
        </Sidebar>
      </div>
    );
  },
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
