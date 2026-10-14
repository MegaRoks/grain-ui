import * as GrainUI from './index';

describe('public API', () => {
  it('экспортирует все компоненты', () => {
    const expected = ['Icon', 'Button', 'IconButton', 'Badge', 'Tag', 'Card', 'CardHeader', 'CardBody', 'CardFooter', 'Input', 'Select', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'Tabs', 'Dialog', 'Popover', 'PopoverItem', 'PopoverSeparator', 'Tooltip', 'Toast', 'Toaster', 'TabPanel', 'registerIcons', 'Stack', 'Inline', 'Grid', 'GridItem', 'AppShell', 'Sidebar', 'SidebarSection', 'NavItem', 'Table', 'Avatar', 'AvatarGroup', 'LineChart', 'BarChart', 'Sparkline', 'Spinner', 'Skeleton', 'SkeletonText', 'LoadingRegion', 'Progress', 'Portal', 'BottomSheet', 'BottomNav', 'ColorSwatches', 'ChipGroup', 'Heatmap', 'CalendarHeatmap', 'cx', 'usePresence', 'useFloating', 'useFocusTrap', 'useScrollLock'];
    for (const name of expected) expect(GrainUI, name).toHaveProperty(name);
  });
});
