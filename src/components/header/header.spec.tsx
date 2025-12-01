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

    const icon = screen.getByLabelText(/Hjem/i);
    expect(icon).toBeInTheDocument();

    expect(logoLink).toMatchInlineSnapshot(`
<a
  class="logo"
  href="https://example.com"
  title="Gå til hovedsiden"
>
  <h1
    class="logo"
    data-size="xl"
    level="1"
  >
    <svg
      aria-label="Hjem"
      fill="none"
      focusable="false"
      font-size="4rem"
      height="1em"
      role="img"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M11.47 2.47a.75.75 0 0 1 1.06 0l7 7c.141.14.22.331.22.53v11a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1-.75-.75v-4.25h-2.5V21a.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75V10a.75.75 0 0 1 .22-.53zm-5.72 7.84v9.94h3.5V16a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4.25h3.5v-9.94L12 4.06z"
        fill="currentColor"
        fill-rule="evenodd"
      />
    </svg>
  </h1>
</a>
`);
  });

  it('renders logo link without href if homeUrl is not provided', () => {
    render(<Header />);
    const logoLink = screen.getByTitle(/Gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).not.toHaveAttribute('href');
  });
});
