import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

const mocks = vi.hoisted(() => ({
  fetchClassificationById: vi.fn(),
  fetchVersionById: vi.fn(),
  getRequestLanguage: vi.fn().mockResolvedValue('nb'),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

vi.mock('@/libs/data/classifications/utils', () => ({
  getRequestLanguage: vi.fn().mockResolvedValue('nb'),
}));

vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));

vi.mock('@/libs/data/classifications/classificationData', () => ({
  fetchClassificationById: mocks.fetchClassificationById,
}));

vi.mock('@/libs/data/classifications/versionsData', () => ({
  fetchVersionById: mocks.fetchVersionById,
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => mocks.logger,
}));

const baseClassification = {
  id: 42,
  name: 'Test',
  fallbackLanguage: undefined,
  versions: [{ id: 42, validFrom: new Date('2024-01-01') }],
} as never;

describe('VersionLayout', () => {
  it('calls notFound when versionNumber is not a number', async () => {
    mocks.fetchClassificationById.mockResolvedValueOnce(baseClassification);
    const { default: VersionLayout } = await import('../../layout');

    await expect(
      VersionLayout({
        children: null,
        download: null,
        params: Promise.resolve({ id: '42', versionNumber: 'abc' }),
      } as never),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('calls notFound when fetchVersionById returns null', async () => {
    mocks.fetchClassificationById.mockResolvedValueOnce(baseClassification);
    mocks.fetchVersionById.mockResolvedValueOnce(null);
    const { default: VersionLayout } = await import('../../layout');

    await expect(
      VersionLayout({
        children: <div>child</div>,
        download: null,
        params: Promise.resolve({ id: '42', versionNumber: '42' }),
      } as never),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.fetchVersionById).toHaveBeenCalledWith(42, 'nb');
    expect(mocks.notFound).toHaveBeenCalled();
  });

  it('calls notFound when fetchVersionById throws', async () => {
    mocks.fetchClassificationById.mockResolvedValueOnce(baseClassification);
    mocks.fetchVersionById.mockRejectedValueOnce(new Error('boom'));
    const { default: VersionLayout } = await import('../../layout');

    await expect(
      VersionLayout({
        children: <div>child</div>,
        download: null,
        params: Promise.resolve({ id: '42', versionNumber: '42' }),
      } as never),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.fetchVersionById).toHaveBeenCalledWith(42, 'nb');
    expect(mocks.logger.error).toHaveBeenCalled();
  });

  it('renders VersionResourceLayer with children when version exists', async () => {
    mocks.fetchClassificationById.mockResolvedValueOnce(baseClassification);
    mocks.fetchVersionById.mockResolvedValueOnce({ id: 42, name: 'Version 1' });
    const { default: VersionLayout } = await import('../../layout');

    const element = await VersionLayout({
      children: <div>child content</div>,
      download: null,
      params: Promise.resolve({ id: '42', versionNumber: '42' }),
    });

    render(element);

    expect(screen.getByTestId('version-layer')).toHaveAttribute('data-version-id', '42');
    expect(screen.getByText('child content')).toBeInTheDocument();

    //expect(result).toBeTruthy();
    //expect(mocks.fetchVersionById).toHaveBeenCalledWith(42, 'nb');
  });
});
