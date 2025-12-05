'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { TextField } from './text-field';

jest.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Label: passthrough('label'),
    Paragraph: passthrough('p'),
    Link: passthrough('a'),
  };
});

describe('TextField', () => {
  it('renders label and value correctly', () => {
    render(<dl><TextField label='Definisjon' value='This is a definition' /></dl>);

    expect(screen.getByText('Definisjon')).toBeInTheDocument();
    expect(screen.getByText('This is a definition')).toBeInTheDocument();
  });

  it('renders long text content in a paragraph', () => {
    const longText = 'This is a very long definition that should be displayed as paragraph text.';
    render(<dl><TextField label='Kommentar' value={longText} longText /></dl>);

    const paragraph = screen.getByText(longText);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe('P');
  });

  it('renders url as link', () => {
    const linkText = 'www.example.com';
    render(<dl><TextField label='Kommentar' value={linkText} href='https://example.com' /></dl>);

    const link = screen.getByRole('link', { name: /lenke/i });

    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
