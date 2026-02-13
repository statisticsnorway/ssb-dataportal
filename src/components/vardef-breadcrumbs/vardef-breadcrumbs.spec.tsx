/** biome-ignore-all lint/suspicious/noExplicitAny: Use any in mocks for convenience */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/libs/language', () => ({
  localization: {
    breadcrumbsLabel: 'MinBrødsmulesti',
  },
}));

jest.mock('@digdir/designsystemet-react', () => {
  const Breadcrumbs = ({ children, ...props }: any) => <nav {...props}>{children}</nav>;
  Breadcrumbs.List = ({ children }: any) => <ol>{children}</ol>;
  Breadcrumbs.Item = ({ children }: any) => <li>{children}</li>;
  Breadcrumbs.Link = ({ children, href, ...props }: any) => {
    // In the component: last crumb uses href={undefined}.
    // We model that as non-link text (span) to assert "not clickable".
    if (!href) return <span {...props}>{children}</span>;
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  return { Breadcrumbs };
});

import { VardefBreadcrumbs } from './index';

describe('VardefBreadcrumbs', () => {
  test('renders nav with aria-label from localization', () => {
    render(<VardefBreadcrumbs homeUrl={{ href: '/', text: 'Hjem' }} breadcrumbList={[{ href: '/a', text: 'A' }]} />);
    expect(screen.getByRole('navigation', { name: 'MinBrødsmulesti' })).toBeInTheDocument();
  });

  test('renders home crumb as a link', () => {
    render(<VardefBreadcrumbs homeUrl={{ href: '/', text: 'Hjem' }} breadcrumbList={[{ href: '/a', text: 'A' }]} />);
    const homeLink = screen.getByRole('link', { name: 'Hjem' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('renders intermediate crumbs as links, and last crumb as current page (not a link)', () => {
    render(
      <VardefBreadcrumbs
        homeUrl={{ href: '/', text: 'Hjem' }}
        breadcrumbList={[
          { href: '/variabeldefinisjoner', text: 'Variabeldefinisjoner' },
          { href: '/variabeldefinisjoner/akap', text: 'Annen kapital' },
        ]}
      />,
    );
    const intermediateCrumb = screen.getByRole('link', { name: 'Variabeldefinisjoner' });
    expect(intermediateCrumb).toHaveAttribute('href', '/variabeldefinisjoner');
    expect(screen.queryByRole('link', { name: 'akap' })).not.toBeInTheDocument();
    const currentCrumb = screen.getByText('Annen kapital');
    expect(currentCrumb).toHaveAttribute('aria-current', 'page');
  });
});
