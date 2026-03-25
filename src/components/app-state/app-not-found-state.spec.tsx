import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppNotFoundState } from '@/components/app-state/app-not-found-state';

const usePathnameMock = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

describe('AppNotFoundState', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/variable-definitions/does-not-exist');
  });

  it('render default texts', () => {
    render(<AppNotFoundState />);
    expect(screen.getByRole('heading', { name: 'Siden finnes ikke' })).toBeInTheDocument();
  });

  it('render home link', () => {
    render(<AppNotFoundState />);
    const homeLink = screen.getByRole('link', { name: 'Gå til forsiden' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('render broken link mail button', () => {
    render(<AppNotFoundState />);
    const link = screen.getByRole('link', { name: 'Meld fra om ødelagt lenke' });
    const href = link.getAttribute('href');
    const url = new URL(href!);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('metadata@ssb.no');
    const params = new URLSearchParams(url.search);
    expect(params.get('subject')).toBe('Ødelagt lenke i dataportalen');
    expect(params.get('body')).toContain('jeg vil melde fra om en mulig ødelagt lenke i Dataportalen');
    expect(params.get('body')).toContain('/variable-definitions/does-not-exist');
  });

  it('render provided help list', () => {
    render(<AppNotFoundState helpList={['Gå en tur', 'Gå hjem!']} />);
    expect(screen.getByText('Du kan prøve å:')).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(within(list).getByText('Gå en tur')).toBeInTheDocument();
    expect(within(list).getByText('Gå hjem!')).toBeInTheDocument();
  });

  it('renders secondary link instead of broken link action when secondary props are set', () => {
    render(<AppNotFoundState secondaryHref='/variable-definitions' secondaryLabel='Variabeldefinisjoner' />);
    expect(screen.getByRole('link', { name: 'Variabeldefinisjoner' })).toHaveAttribute('href', '/variable-definitions');
    expect(screen.queryByRole('link', { name: 'Meld fra om ødelagt lenke' })).not.toBeInTheDocument();
  });

  it('does not render broken link action when disabled', () => {
    render(<AppNotFoundState showBrokenLinkButton={false} />);
    expect(screen.queryByRole('link', { name: 'Meld fra om ødelagt lenke' })).not.toBeInTheDocument();
  });

  it('uses custom home href when provided', () => {
    render(<AppNotFoundState homeHref='/custom-home' />);
    expect(screen.getByRole('link', { name: 'Gå til forsiden' })).toHaveAttribute('href', '/custom-home');
  });
});
