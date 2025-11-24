'use client';
import { render, screen } from '@testing-library/react';
import React, { FC, PropsWithChildren } from 'react';
import { Header } from '.';

type ChildrenProps = PropsWithChildren<object>;

jest.mock('@digdir/designsystemet-react', () => {

  const Link: FC<any> = ({ children, href, title }) => (
    <a href={href} title={title}>
      {children}
    </a>
  );

  const Button: FC<ChildrenProps> = ({ children }) => <button>{children}</button>;
  const ExternalLinkIcon: FC = () => <span>🔗</span>;

  return {
    Button,
    Link,
    ExternalLinkIcon,
  };
});

describe('Header', () => {
  it('renders the logo link with correct href and text', () => {
    const { asFragment } = render(<Header homeUrl='https://example.com' />);

    const logoLink = screen.getByTitle(/gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://example.com');

    const logoText = screen.getByText(/Logo/i);
    expect(logoText).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders logo link without href if homeUrl is not provided', () => {
    render(<Header />);
    const logoLink = screen.getByTitle(/gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).not.toHaveAttribute('href');
});
});
