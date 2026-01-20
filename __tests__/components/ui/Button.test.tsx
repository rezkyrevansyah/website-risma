import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('applies variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  test('renders as child when asChild is true', () => {
      // Testing slot functionality implicitly if your button supports it via Radix Slot
      render(
        <Button asChild>
            <a href="/test">Link Button</a>
        </Button>
      );
      const linkElement = screen.getByRole('link', { name: /link button/i });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveClass('inline-flex'); // Check for base button classes on the link
  });
});
