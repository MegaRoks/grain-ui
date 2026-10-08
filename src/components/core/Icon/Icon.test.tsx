import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('принимает kebab- и Pascal-имена', () => {
    const { container } = render(<><Icon name="arrow-right" /><Icon name="ArrowRight" /></>);
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
  it('декоративна без label', () => {
    const { container } = render(<Icon name="x" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('с label становится img', () => {
    render(<Icon name="x" label="Закрыть" />);
    expect(screen.getByRole('img', { name: 'Закрыть' })).toBeInTheDocument();
  });
  it('неизвестное имя ничего не рендерит', () => {
    const { container } = render(<Icon name="no-such-icon" />);
    expect(container).toBeEmptyDOMElement();
  });
});
