import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VersionView } from './VersionView';

const mocks = vi.hoisted(() => ({
  pathname: '/classifications/104/version/10',
  replace: vi.fn(),
  prefetch: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    replace: mocks.replace,
    prefetch: mocks.prefetch,
    push: vi.fn(),
  }),
}));

vi.mock('@/components/app-state', () => ({
  AppNotFoundState: () => <div data-testid='not-found' />,
}));

vi.mock('@digdir/designsystemet-react', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Divider: () => <hr />,
  Heading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  Tag: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Tabs: Object.assign(({ children }: { children: React.ReactNode }) => <div>{children}</div>, {
    List: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Tab: ({ children }: { children: React.ReactNode }) => <button type='button'>{children}</button>,
    Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }),
}));

const classification = {
  id: 104,
  versions: [
    { id: 10, name: 'Old version', validFrom: new Date('2020-01-01') },
    { id: 20, name: 'Latest version', validFrom: new Date('2025-01-01') },
  ],
};

describe('VersionView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.pathname = '/classifications/104/version/10';
  });

  it('redirects a bare version route to its codes tab', async () => {
    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/classifications/104/version/10/codes'));
  });

  it('renders the version not-found state for an unknown version', () => {
    mocks.pathname = '/classifications/104/version/999/codes';

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByTestId('not-found')).toBeVisible();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('renders the version not-found state for a malformed version route', () => {
    mocks.pathname = '/classifications/104/version/invalid/codes';

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByTestId('not-found')).toBeVisible();
  });

  it('uses the latest version and prefetches its changes tab', async () => {
    mocks.pathname = '/classifications/104/codes';

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByText('Latest version')).toBeVisible();
    await waitFor(() => expect(mocks.prefetch).toHaveBeenCalledWith('/classifications/104/changes'));
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('prefetches changes for a specific version', async () => {
    mocks.pathname = '/classifications/104/version/10/codes';

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    await waitFor(() => expect(mocks.prefetch).toHaveBeenCalledWith('/classifications/104/version/10/changes'));
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('renders the version not-found state when there are no versions', () => {
    render(
      <VersionView classification={{ id: 104, versions: [] }}>
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByTestId('not-found')).toBeVisible();
  });
});
