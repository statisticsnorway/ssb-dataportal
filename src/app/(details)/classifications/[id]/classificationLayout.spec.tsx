import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetchClassificationById: vi.fn(),
  fetchVersionById: vi.fn(),
  resolveLanguage: vi.fn(),
  cookies: vi.fn(),
  headers: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/libs/data/classifications/classificationData', () => ({
  fetchClassificationById: mocks.fetchClassificationById,
}));

vi.mock('@/libs/data/classifications/versionsData', () => ({
  fetchVersionById: mocks.fetchVersionById,
}));

vi.mock('@/libs/language', () => ({
  languageCookieName: 'lang',
  resolveLanguage: mocks.resolveLanguage,
}));

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
  headers: mocks.headers,
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('@/libs/logger/sanitize', () => ({
  sanitizeError: (e: unknown) => e,
}));

vi.mock('@/components/dataportal-breadcrumbs', () => ({
  DataportalBreadcrumbs: () => <nav data-testid='breadcrumbs' />,
}));

vi.mock('@digdir/designsystemet-react', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/utils/breadcrumbs', () => ({
  getHomeBreadcrumb: () => '/',
}));

vi.mock('@/libs/language/src/localization', () => ({
  localization: {
    classification: {
      labelPlural: 'Klassifikasjoner',
    },
  },
}));

vi.mock('../components/classificationDetail', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <section data-testid='classification-detail'>{children}</section>
  ),
}));

vi.mock('../components/versionContext', () => ({
  VersionResourceLayer: ({
    versionResource,
    children,
  }: {
    versionResource?: { id?: number } | null;
    children: React.ReactNode;
  }) => (
    <div data-testid='version-layer' data-version-id={versionResource?.id ?? ''}>
      {children}
    </div>
  ),
}));

async function importLayoutModule() {
  return import('./layout');
}

describe('classification [id] layout', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();

    mocks.resolveLanguage.mockReturnValue('nb');
    mocks.cookies.mockResolvedValue({
      get: () => ({ value: 'nb' }),
    });
    mocks.headers.mockResolvedValue({
      get: () => 'nb-NO',
    });
  });

  it('generateMetadata returns classification name when found', async () => {
    mocks.fetchClassificationById.mockResolvedValue({
      name: 'KPI Classification',
      versions: [{ id: 1, validFrom: new Date('2024-01-01') }],
    });

    const { generateMetadata } = await importLayoutModule();
    const metadata = await generateMetadata({ params: Promise.resolve({ id: '42' }) });

    expect(metadata).toEqual({ title: 'KPI Classification' });
  });

  it('generateMetadata falls back to id when fetch fails', async () => {
    mocks.fetchClassificationById.mockRejectedValue(new Error('boom'));

    const { generateMetadata } = await importLayoutModule();
    const metadata = await generateMetadata({ params: Promise.resolve({ id: '42' }) });

    expect(metadata).toEqual({ title: '42' });
  });

  it('renders detail page with latest version resource', async () => {
    mocks.fetchClassificationById.mockResolvedValue({
      name: 'Classification A',
      versions: [
        { id: 10, validFrom: new Date('2020-01-01') },
        { id: 20, validFrom: new Date('2025-01-01') },
      ],
    });
    mocks.fetchVersionById.mockResolvedValue({ id: 20 });

    const mod = await importLayoutModule();
    const element = await mod.default({
      children: <div>child content</div>,
      params: Promise.resolve({ id: '7' }),
    });

    render(element);

    expect(mocks.fetchVersionById).toHaveBeenCalledWith(20, 'nb');
    expect(screen.getByTestId('version-layer')).toHaveAttribute('data-version-id', '20');
    expect(screen.getByTestId('classification-detail')).toBeInTheDocument();
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('calls notFound instead of falling back to the latest version for an unknown version', async () => {
    mocks.fetchClassificationById.mockResolvedValue({
      name: 'Classification A',
      versions: [{ id: 10, validFrom: new Date('2020-01-01') }],
    });

    const mod = await importLayoutModule();

    await expect(
      mod.default({
        children: <div>child</div>,
        params: Promise.resolve({ id: '7', versionNumber: '11551' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.fetchVersionById).not.toHaveBeenCalled();
    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('loads the requested version instead of the latest version', async () => {
    mocks.fetchClassificationById.mockResolvedValue({
      name: 'Classification A',
      versions: [
        { id: 10, validFrom: new Date('2020-01-01') },
        { id: 20, validFrom: new Date('2025-01-01') },
      ],
    });
    mocks.fetchVersionById.mockResolvedValue({ id: 10 });

    const mod = await importLayoutModule();
    const element = await mod.default({
      children: <div>child content</div>,
      params: Promise.resolve({ id: '7', versionNumber: '10' }),
    });

    render(element);

    expect(mocks.fetchVersionById).toHaveBeenCalledWith(10, 'nb');
    expect(screen.getByTestId('version-layer')).toHaveAttribute('data-version-id', '10');
  });

  it('calls notFound when classification has no versions', async () => {
    mocks.fetchClassificationById.mockResolvedValue({
      name: 'Empty',
      versions: [],
    });

    const mod = await importLayoutModule();

    await expect(
      mod.default({
        children: <div>child</div>,
        params: Promise.resolve({ id: '9' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('calls notFound when classification fetch fails', async () => {
    mocks.fetchClassificationById.mockRejectedValue(new Error('fetch failed'));

    const mod = await importLayoutModule();

    await expect(
      mod.default({
        children: <div>child</div>,
        params: Promise.resolve({ id: '9' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalled();
  });
});
