/** biome-ignore-all lint/suspicious/noExplicitAny: Use any in mocks for convenience */
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DataportalBreadcrumbs } from './index';

vi.mock('@/libs/language', () => ({
  localization: {
    breadcrumbsLabel: 'MinBrødsmulesti',
  },
}));

vi.mock('@digdir/designsystemet-react', () => {
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

describe('VardefBreadcrumbs', () => {
  test('renders nav with aria-label from localization', () => {
    render(<DataportalBreadcrumbs homeUrl={{ href: '/', text: 'Hjem' }} items={[{ href: '/a', text: 'A' }]} />);
    expect(screen.getByRole('navigation', { name: 'MinBrødsmulesti' })).toBeTruthy();
  });

  test('renders home crumb as a link', () => {
    render(<DataportalBreadcrumbs homeUrl={{ href: '/', text: 'Hjem' }} items={[{ href: '/a', text: 'A' }]} />);
    const homeLink = screen.getByRole('link', { name: 'Hjem' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('renders intermediate crumbs as links, and last crumb as current page (not a link)', () => {
    render(
      <DataportalBreadcrumbs
        homeUrl={{ href: '/', text: 'Hjem' }}
        items={[{ href: '/variabeldefinisjoner', text: 'Variabeldefinisjoner' }]}
        currentText={'Annen kapital'}
      />,
    );
    const intermediateCrumb = screen.getByRole('link', { name: 'Variabeldefinisjoner' });
    expect(intermediateCrumb).toHaveAttribute('href', '/variabeldefinisjoner');
    expect(screen.queryByRole('link', { name: 'akap' })).not.toBeInTheDocument();
    const currentCrumb = screen.getByText('Annen kapital');
    expect(currentCrumb).toHaveAttribute('aria-current', 'page');
  });
});
