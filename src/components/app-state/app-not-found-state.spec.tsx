import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppNotFoundState } from '@/components/app-state/app-not-found-state';
import { localization } from '@/libs/language';
import { getContactEmailAddress } from '@/utils/userAgent';

const { usePathnameMock } = vi.hoisted(() => {
  return {
    usePathnameMock: vi.fn(),
  };
});

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

describe('AppNotFoundState', () => {
  const { notFoundTitle, notFoundMessage, goHome, reportBrokenLink, brokenLinkMailSubject } = localization.error;

  beforeEach(() => {
    process.env.CONTACT_EMAIL_ADDRESS = 'informasjon@ssb.no';
    usePathnameMock.mockReturnValue('/variable-definitions/does-not-exist');
  });

  it('render default text', () => {
    render(<AppNotFoundState />);
    expect(screen.getByRole('heading', { name: notFoundTitle })).toBeInTheDocument();
    expect(screen.getByText(notFoundMessage)).toBeInTheDocument();
  });

  it('renders overridden title', () => {
    render(<AppNotFoundState title='Custom title' />);
    expect(screen.getByRole('heading', { name: 'Custom title' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: notFoundTitle })).not.toBeInTheDocument();
  });

  it('renders overridden message', () => {
    render(<AppNotFoundState message='Custom message' />);
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.queryByText(notFoundMessage)).not.toBeInTheDocument();
  });

  it('renders overridden title and message together', () => {
    render(<AppNotFoundState title='Custom title' message='Custom message' />);
    expect(screen.getByRole('heading', { name: 'Custom title' })).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('render home link', () => {
    render(<AppNotFoundState />);
    const homeLink = screen.getByRole('link', { name: goHome });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('render broken link mail button', () => {
    render(<AppNotFoundState />);
    const link = screen.getByRole('link', { name: reportBrokenLink });
    const href = link.getAttribute('href');
    const url = new URL(href!);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe(getContactEmailAddress());
    const params = new URLSearchParams(url.search);
    expect(params.get('subject')).toBe(brokenLinkMailSubject);
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
    expect(screen.queryByRole('link', { name: reportBrokenLink })).not.toBeInTheDocument();
  });

  it('does not render broken link action when disabled', () => {
    render(<AppNotFoundState showBrokenLinkButton={false} />);
    expect(screen.queryByRole('link', { name: reportBrokenLink })).not.toBeInTheDocument();
  });

  it('uses custom home href when provided', () => {
    render(<AppNotFoundState homeHref='/custom-home' />);
    expect(screen.getByRole('link', { name: goHome })).toHaveAttribute('href', '/custom-home');
  });

  it('renders custom status code when provided', () => {
    render(<AppNotFoundState statusCode='410' />);
    expect(screen.getByText('Feilkode: 410')).toBeInTheDocument();
  });
});
