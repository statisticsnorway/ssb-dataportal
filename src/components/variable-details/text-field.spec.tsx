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
  };
});

describe('TextField', () => {
  it('renders label and value correctly', () => {
    render(<TextField label='Definisjon' value='This is a definition' />);

    expect(screen.getByText('Definisjon')).toBeInTheDocument();
    expect(screen.getByText('This is a definition')).toBeInTheDocument();
  });

  it('renders long text content in a paragraph', () => {
    const longText = 'This is a very long definition that should be displayed as paragraph text.';
    render(<TextField label='Kommentar' value={longText} />);

    const paragraph = screen.getByText(longText);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe('P');
  });
});
