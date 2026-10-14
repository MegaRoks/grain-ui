import { render, screen } from '@testing-library/react';
import { ArrowRight, Rocket } from 'lucide-react';
import { Icon, registerIcons } from './Icon';

describe('Icon', () => {
  it('после registerIcons принимает kebab- и Pascal-имена', () => {
    registerIcons({ ArrowRight });
    const { container } = render(<><Icon name="arrow-right" /><Icon name="ArrowRight" /></>);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
  it('принимает компонент напрямую', () => {
    const { container } = render(<Icon name={Rocket} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('встроенные иконки кита доступны без регистрации', () => {
    const { container } = render(<Icon name="chevron-down" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('декоративна без label', () => {
    const { container } = render(<Icon name="x" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('с label становится img', () => {
    render(<Icon name="x" label="Закрыть" />);
    expect(screen.getByRole('img', { name: 'Закрыть' })).toBeInTheDocument();
  });
  it('незарегистрированное имя ничего не рендерит и предупреждает один раз', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<><Icon name="no-such-icon" /><Icon name="no-such-icon" /></>);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
