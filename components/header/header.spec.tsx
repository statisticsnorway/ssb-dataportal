'use client'
import React from 'react';
import { render, screen} from '@testing-library/react';
import { Header } from '.';

// Mock external component
jest.mock('@digdir/designsystemet-react', () => {
  const React = require('react');

  const MockDropdownMenu = ({ children }: any) => <div>{children}</div>;
  MockDropdownMenu.Trigger = ({ children }: any) => <>{children}</>;
  MockDropdownMenu.Content = ({ children }: any) => <>{children}</>;
  MockDropdownMenu.Group = ({ children }: any) => <>{children}</>;
  MockDropdownMenu.Item = ({ children }: any) => <>{children}</>;

  return {
    Button: ({ children }: any) => <button>{children}</button>,
    Divider: ({ children }: any) => <div>{children}</div>,
    DropdownMenu: MockDropdownMenu,
    MenuHamburgerIcon: () => <span>☰</span>,
    ExternalLinkIcon: () => <span>🔗</span>,
  };
});

describe('Header', () => {
  it('renders the logo link with correct href and text', () => {
    const { asFragment } = render(<Header homeUrl="https://example.com" />);

    const logoLink = screen.getByTitle(/gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://example.com');

    const logoText = screen.getByText(/Metadataportalen/i);
    expect(logoText).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
