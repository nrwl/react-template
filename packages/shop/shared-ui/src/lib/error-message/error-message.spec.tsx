import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './error-message';

describe('ErrorMessage', () => {
  it('should display default message when no message prop provided', () => {
    render(<ErrorMessage />);

    expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
  });

  it('should display custom error message', () => {
    render(<ErrorMessage message="Custom error message" />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should show retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not show retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);

    const retryButton = screen.queryByRole('button', { name: 'Try Again' });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should display error icon', () => {
    render(<ErrorMessage />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});