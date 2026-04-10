'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '.';

vi.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);
  const Dialog = Object.assign(passthrough('dialog'), {
    Trigger: passthrough('button'),
    TriggerContext: passthrough('div'),
  });

  return {
    Link: passthrough('a'),
    Heading: passthrough('h1'),
    Button: passthrough('button'),
    Dialog,
    ExternalLinkIcon: () => <span>🔗</span>,
  };
});
vi.mock('@/app/authContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/components/login-button', () => ({
  LoginButton: () => <div data-testid='login-button' />,
}));

describe('Header', () => {
  it('renders the logo link with correct href and text', () => {
    render(<Header homeUrl='https://example.com' />);

    const logoLink = screen.getByRole('link');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://example.com');
    expect(logoLink).toMatchInlineSnapshot(`
      <a
        class="_logoAndTitle_05898b"
        href="https://example.com"
        title="Naviger til hjemmesiden"
      >
        <img
          alt="Statistisk sentralbyrå logo"
          class="_logo_05898b"
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
  it('renders login button', () => {
    render(<Header homeUrl='https://example.com' />);

    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });
});
