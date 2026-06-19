import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toBeInTheDocument();
  });

  it('should display loading text', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render three bounce animations', () => {
    const { container } = render(<LoadingSpinner />);

    // CSS modules generate unique class names, so we check for elements with class containing 'bounce'
    const bounceElements = container.querySelectorAll('[class*="bounce"]');

    // Should have exactly 3 bounce elements
    expect(bounceElements).toHaveLength(3);
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });
});