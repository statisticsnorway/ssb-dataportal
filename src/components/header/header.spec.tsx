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
    render(<Header homeUrl='https://example.com' />);

    const logoLink = screen.getByRole('link');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://example.com');
    expect(logoLink).toMatchInlineSnapshot(`
<a
  class="logoAndTitle"
  href="https://example.com"
>
  <img
    alt="undefined logo"
    class="logo"
    data-nimg="1"
    decoding="async"
    height="44"
    src="/ssb-logo.svg"
    style="color: transparent;"
    width="240"
  />
</a>
`);
  });

  it('renders logo link without href if homeUrl is not provided', () => {
    render(<Header />);
    const logoLink = screen.getByAltText(/logo/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).not.toHaveAttribute('href');
  });
});
