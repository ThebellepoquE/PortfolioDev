import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './error.tsx';

describe('ErrorPage', () => {
  it('renders a fallback message when an error is provided', () => {
    render(<ErrorPage error={new Error('test error')} reset={() => {}} />);

    expect(screen.getByText(/algo se ha roto/i)).toBeInTheDocument();
  });

  it('calls reset when the retry button is clicked', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('test error')} reset={reset} />);

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
