import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetchVersionById: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
  createLogger: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(() => ({ value: 'nb' })),
  })),
  headers: vi.fn(async () => ({
    get: vi.fn((name: string) => (name === 'accept-language' ? 'nb' : null)),
  })),
}));

mocks.createLogger.mockReturnValue(mocks.logger);

vi.mock('@/libs/data/classifications/versionsData', () => ({
  fetchVersionById: mocks.fetchVersionById,
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: mocks.createLogger,
}));

vi.mock('@/app/(details)/classifications/components/versionContext', () => ({
  VersionResourceLayer: ({
    versionResource,
    children,
  }: {
    versionResource: { id?: number };
    children: React.ReactNode;
  }) => (
    <div data-testid='version-layer' data-version-id={versionResource?.id ?? ''}>
      {children}
    </div>
  ),
}));

describe('VersionLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls notFound when versionNumber is not a number', async () => {
    const { default: VersionLayout } = await import('./layout');

    await expect(
      VersionLayout({
        children: <div>child</div>,
        params: Promise.resolve({ id: '2003', versionNumber: 'abc' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.fetchVersionById).not.toHaveBeenCalled();
    expect(mocks.logger.warn).toHaveBeenCalledWith({ versionNumber: 'abc' }, 'Invalid versionNumber param');
    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('calls notFound when fetchVersionById returns null', async () => {
    mocks.fetchVersionById.mockResolvedValue(null);
    const { default: VersionLayout } = await import('./layout');

    await expect(
      VersionLayout({
        children: <div>child</div>,
        params: Promise.resolve({ id: '2003', versionNumber: '42' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.fetchVersionById).toHaveBeenCalledWith(42, 'nb');
    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('calls notFound when fetchVersionById throws', async () => {
    mocks.fetchVersionById.mockRejectedValue(new Error('boom'));
    const { default: VersionLayout } = await import('./layout');

    await expect(
      VersionLayout({
        children: <div>child</div>,
        params: Promise.resolve({ id: '2003', versionNumber: '42' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.fetchVersionById).toHaveBeenCalledWith(42, 'nb');
    expect(mocks.logger.error).toHaveBeenCalledWith(
      { error: new Error('boom'), versionId: 42 },
      'Failed to fetch version by id',
    );
    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('renders VersionResourceLayer with children when version exists', async () => {
    mocks.fetchVersionById.mockResolvedValue({ id: 42 });
    const { default: VersionLayout } = await import('./layout');

    const element = await VersionLayout({
      children: <div>child content</div>,
      params: Promise.resolve({ id: '2003', versionNumber: '42' }),
    });

    render(element);

    expect(screen.getByTestId('version-layer')).toHaveAttribute('data-version-id', '42');
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
