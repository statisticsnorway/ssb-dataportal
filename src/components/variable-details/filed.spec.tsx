'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { Field } from './field';


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
    render(<Field label='Team' value='Team-a' />);

    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Team-a')).toBeInTheDocument();
  });

  it('renders link correctly', () => {
    render(<Field label='Url' value='Link' href='https://www.example.com' />);

    expect(screen.getByText('Url')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
    expect(screen.getByText('Link')).toHaveAttribute('href', 'https://www.example.com');
  });
});
