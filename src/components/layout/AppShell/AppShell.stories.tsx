import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AppShell } from './AppShell';
import { Sidebar, SidebarSection, NavItem } from '../../navigation/Sidebar';
import { Button } from '../../core/Button';
import { Card, CardBody } from '../../core/Card';
import { Grid } from '../Stack';

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <AppShell
        sidebarOpen={open}
        onSidebarOpenChange={setOpen}
        contained
        sidebar={
          <Sidebar header={<strong style={{ padding: '4px 8px', display: 'block' }}>grain</strong>}>
            <SidebarSection>
              <NavItem icon="layout-dashboard" active>Обзор</NavItem>
              <NavItem icon="rocket">Деплои</NavItem>
              <NavItem icon="scroll-text">Логи</NavItem>
            </SidebarSection>
          </Sidebar>
        }
        header={
          <>
            <strong style={{ fontSize: 14 }}>Обзор</strong>
            <span style={{ flex: 1 }} />
            <Button size="sm" variant="solid" iconStart="plus">Новый проект</Button>
          </>
        }
      >
        <Grid minColumnWidth={220} gap={4}>
          {['Запросы', 'Ошибки', 'p95', 'Деплои'].map((t) => <Card key={t}><CardBody>{t}</CardBody></Card>)}
        </Grid>
      </AppShell>
    );
  },
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Сузьте окно до &lt;768px — сайдбар станет выезжающей панелью (кнопка меню в шапке). */
export const Default: Story = {};
