import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { VersionView } from './VersionView';

const mocks = vi.hoisted(() => ({
  pathname: '/classifications/104/versions/10',
  replace: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
}));

const fetchVersionByIdMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    replace: mocks.replace,
    prefetch: mocks.prefetch,
    push: mocks.push,
  }),
}));

vi.mock('@/libs/data/classifications/versionsData', () => ({
  fetchVersionById: fetchVersionByIdMock,
}));

vi.mock('@/components/app-state', () => ({
  AppNotFoundState: () => <div data-testid='not-found' />,
}));

vi.mock('@digdir/designsystemet-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@digdir/designsystemet-react')>();
  const mockedTabs = Object.assign(
    ({ children, onChange }: { children: React.ReactNode; onChange?: (value: string) => void }) => (
      <div>
        {children}
        <button type='button' data-testid='select-details' onClick={() => onChange?.('detailsTab')} />
        <button type='button' data-testid='select-unknown' onClick={() => onChange?.('unknownTab')} />
      </div>
    ),
    {
      List: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Tab: ({ children }: { children: React.ReactNode }) => <button type='button'>{children}</button>,
      Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
  ) as unknown as typeof actual.Tabs;

  return {
    ...actual,
    Alert: (({ children }: { children: React.ReactNode }) => <div>{children}</div>) as unknown as typeof actual.Alert,
    Divider: (() => <hr />) as unknown as typeof actual.Divider,
    Heading: (({ children }: { children: React.ReactNode }) => <h2>{children}</h2>) as unknown as typeof actual.Heading,
    Tag: (({ children }: { children: React.ReactNode }) => <span>{children}</span>) as unknown as typeof actual.Tag,
    Tabs: mockedTabs,
  };
});

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
    mocks.pathname = buildUrl({ classificationId: 104, versionId: 10 });
    fetchVersionByIdMock.mockResolvedValue(undefined);
  });

  it('redirects a bare version route to its codes tab', async () => {
    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith(buildUrl({ classificationId: 104, versionId: 10, tab: 'codes' })),
    );
  });

  it('renders the version not-found state for an unknown version', () => {
    mocks.pathname = buildUrl({ classificationId: 104, versionId: 999, tab: 'codes' });

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByTestId('not-found')).toBeVisible();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('renders the version not-found state for a malformed version route', () => {
    mocks.pathname = '/classifications/104/versions/invalid/codes';

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
    mocks.pathname = buildUrl({ classificationId: 104, versionId: 10, tab: 'codes' });

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    await waitFor(() =>
      expect(mocks.prefetch).toHaveBeenCalledWith(buildUrl({ classificationId: 104, versionId: 10, tab: 'changes' })),
    );
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('pushes the selected tab URL for a specific version', async () => {
    mocks.pathname = buildUrl({ classificationId: 104, versionId: 10, tab: 'codes' });

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    fireEvent.click(screen.getByTestId('select-details'));

    expect(mocks.push).toHaveBeenCalledWith(buildUrl({ classificationId: 104, versionId: 10, tab: 'details' }));
  });

  it('does not navigate when the selected tab is unknown', () => {
    mocks.pathname = '/classifications/104/codes';

    render(
      <VersionView classification={classification}>
        <div>Codes</div>
      </VersionView>,
    );

    fireEvent.click(screen.getByTestId('select-unknown'));

    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('renders the version not-found state when there are no versions', () => {
    render(
      <VersionView classification={{ id: 104, versions: [] }}>
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByTestId('not-found')).toBeVisible();
  });

  it('refetches the introduction text when navigating client-side to a different version', async () => {
    mocks.pathname = buildUrl({ classificationId: 104, versionId: 10, tab: 'codes' });
    fetchVersionByIdMock.mockResolvedValue({ id: 20, introduction: 'Latest version introduction' });

    const { rerender } = render(
      <VersionView
        classification={classification}
        classificationVersion={{ id: 10, introduction: 'Old version introduction' }}
      >
        <div>Codes</div>
      </VersionView>,
    );

    expect(screen.getByText('Old version introduction')).toBeVisible();

    mocks.pathname = buildUrl({ classificationId: 104, versionId: 20, tab: 'codes' });
    rerender(
      <VersionView
        classification={classification}
        classificationVersion={{ id: 10, introduction: 'Old version introduction' }}
      >
        <div>Codes</div>
      </VersionView>,
    );

    await waitFor(() => expect(fetchVersionByIdMock).toHaveBeenCalledWith(20, expect.any(String)));
    await waitFor(() => expect(screen.getByText('Latest version introduction')).toBeVisible());
  });
});
