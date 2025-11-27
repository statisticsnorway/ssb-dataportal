'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { Header } from '.';

jest.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Link: passthrough('a'),
    Heading: passthrough('h1'),
    Button: passthrough('button'),
    ExternalLinkIcon: () => <span>🔗</span>,
  };
});

describe('Header', () => {
  it('renders the logo link with correct href and text', () => {
    const { asFragment } = render(<Header homeUrl='https://example.com' />);

    const logoLink = screen.getByTitle(/Gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://example.com');

    const logoText = screen.getByText(/Logo/i);
    expect(logoText).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders logo link without href if homeUrl is not provided', () => {
    render(<Header />);
    const logoLink = screen.getByTitle(/Gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).not.toHaveAttribute('href');
  });
});
