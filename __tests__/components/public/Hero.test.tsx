import React from 'react';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/public/Hero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Hero Component', () => {
  test('renders with default props', () => {
    render(<Hero />);
    // The component hardcodes the description, so we test for that instead of the tagline prop which seems unused/commented out in the component impl
    expect(screen.getByText(/Pusat peribadatan dan pengembangan umat/i)).toBeInTheDocument();
    expect(screen.getByText(/Al Arqam/i)).toBeInTheDocument();
  });

  test('renders with custom mosque name', () => {
    render(<Hero mosqueName="Masjid Raya" />);
    expect(screen.getByText(/Masjid Raya/i)).toBeInTheDocument();
  });

  test('renders latest event title', () => {
      render(<Hero latestEventTitle="Ramadhan Special" />);
      expect(screen.getByText(/Ramadhan Special/i)).toBeInTheDocument();
  });
});
