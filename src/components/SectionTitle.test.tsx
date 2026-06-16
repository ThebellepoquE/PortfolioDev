import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionTitle } from './SectionTitle';
import { checkA11y } from '../test/a11y-utils';

describe('SectionTitle', () => {
  it('renderiza un <h2> con las clases title-neon y text-gradient', () => {
    render(<SectionTitle>Test Title</SectionTitle>);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('title-neon', 'text-gradient');
    expect(heading).toHaveTextContent('Test Title');
  });

  it('acepta prop className adicional', () => {
    render(<SectionTitle className="hero__title">Hero</SectionTitle>);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('title-neon', 'text-gradient', 'hero__title');
  });

  it('acepta prop title como alternativa a children', () => {
    render(<SectionTitle title="Via Prop" />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Via Prop');
  });

  it('sin className extra no deja espacio sobrante', () => {
    render(<SectionTitle>Clean</SectionTitle>);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toBe('title-neon text-gradient');
  });});

describe('SectionTitle a11y', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<SectionTitle>Accessible Title</SectionTitle>);
    const results = await checkA11y(container);
    expect(results).toHaveNoViolations();
  });

  it.skip('color contrast requires manual browser verification', async () => {
    // TODO: axe color-contrast rule doesn't work in jsdom, test manually in browser
  });
});
