import * as GrainUI from './index';

describe('public API', () => {
  it('экспортирует все компоненты', () => {
    const expected = ['Icon', 'Button', 'IconButton', 'Badge', 'Tag', 'Card', 'CardHeader', 'CardBody', 'CardFooter', 'Input', 'Select', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'Tabs', 'Dialog', 'Popover', 'PopoverItem', 'PopoverSeparator', 'Tooltip', 'Toast', 'Toaster', 'cx', 'usePresence'];
    for (const name of expected) expect(GrainUI, name).toHaveProperty(name);
  });
});
