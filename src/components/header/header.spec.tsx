'use client';
import { render, screen } from '@testing-library/react';
import React, { FC, PropsWithChildren } from 'react';
import { Header } from '.';

type ChildrenProps = PropsWithChildren<object>;

interface MockDropdownMenuType extends FC<ChildrenProps> {
  Trigger?: FC<ChildrenProps>;
  Content?: FC<ChildrenProps>;
  Group?: FC<ChildrenProps>;
  Item?: FC<ChildrenProps>;
}

jest.mock('@digdir/designsystemet-react', () => {
  const makePart = (name: string): FC<ChildrenProps> => {
    const Part: FC<ChildrenProps> = ({ children }) => <>{children}</>;
    Part.displayName = name;
    return Part;
  };

  const MockDropdownMenu: MockDropdownMenuType = ({ children }) => <div>{children}</div>;
  MockDropdownMenu.displayName = 'MockDropdownMenu';
  MockDropdownMenu.Trigger = makePart('DropdownMenu.Trigger');
  MockDropdownMenu.Content = makePart('DropdownMenu.Content');
  MockDropdownMenu.Group = makePart('DropdownMenu.Group');
  MockDropdownMenu.Item = makePart('DropdownMenu.Item');

  const Link: FC<any> = ({ children, href, title }) => (
    <a href={href} title={title}>
      {children}
    </a>
  );

  const Button: FC<ChildrenProps> = ({ children }) => <button>{children}</button>;
  const Divider: FC<ChildrenProps> = ({ children }) => <div>{children}</div>;
  const MenuHamburgerIcon: FC = () => <span>☰</span>;
  const ExternalLinkIcon: FC = () => <span>🔗</span>;

  return {
    Button,
    Divider,
    DropdownMenu: MockDropdownMenu,
    Link,
    MenuHamburgerIcon,
    ExternalLinkIcon,
  };
});

describe('Header', () => {
  it('renders the logo link with correct href and text', () => {
    const { asFragment } = render(<Header homeUrl='https://example.com' />);

    const logoLink = screen.getByTitle(/gå til hovedsiden/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://example.com');

    const logoText = screen.getByText(/Metadataportalen/i);
    expect(logoText).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
