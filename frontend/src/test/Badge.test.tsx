import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VegBadge, FeaturedBadge, StatusBadge } from '../components/ui/Badge';

describe('Badge Components', () => {
  it('renders 100% Pure Vegetarian badge with title', () => {
    render(<VegBadge />);
    const vegElement = screen.getByTitle('100% Pure Vegetarian');
    expect(vegElement).toBeInTheDocument();
  });

  it('renders FeaturedBadge with default and custom labels', () => {
    const { rerender } = render(<FeaturedBadge />);
    expect(screen.getByText(/★ Signature/i)).toBeInTheDocument();

    rerender(<FeaturedBadge label="Chef Pick" />);
    expect(screen.getByText(/★ Chef Pick/i)).toBeInTheDocument();
  });

  it('renders StatusBadge with formatted text', () => {
    const { rerender } = render(<StatusBadge status="out_for_delivery" />);
    expect(screen.getByText('OUT FOR DELIVERY')).toBeInTheDocument();

    rerender(<StatusBadge status="confirmed" />);
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
  });
});
