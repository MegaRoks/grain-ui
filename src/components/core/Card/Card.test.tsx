import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('Card', () => {
  it('собирает модификаторы', () => {
    render(<Card data-testid="c" variant="raised" interactive divided />);
    expect(screen.getByTestId('c')).toHaveClass('gr-card', 'gr-card--raised', 'gr-card--interactive', 'gr-card--divided');
  });
  it('рендерит шапку, тело и футер', () => {
    render(
      <Card>
        <CardHeader title="Заголовок" subtitle="Подзаголовок" actions={<button>A</button>} />
        <CardBody>Тело</CardBody>
        <CardFooter>Футер</CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeInTheDocument();
    expect(screen.getByText('Подзаголовок')).toBeInTheDocument();
    expect(screen.getByText('Тело')).toHaveClass('gr-card__body');
    expect(screen.getByText('Футер')).toHaveClass('gr-card__footer');
  });
});
