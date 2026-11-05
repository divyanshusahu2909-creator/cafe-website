import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

describe('Logo Component', () => {
  it('renders brand name and link to home', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );

    const brandName = screen.getByText(/Aesthetic Aroma/i);
    expect(brandName).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders tagline when showTagline is true', () => {
    render(
      <BrowserRouter>
        <Logo showTagline={true} />
      </BrowserRouter>
    );

    const tagline = screen.getByText(/Where Every Sip Feels Special/i);
    expect(tagline).toBeInTheDocument();
  });
});
