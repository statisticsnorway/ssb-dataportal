import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  routeDialog: vi.fn(() => <div data-testid='variant-download-dialog' />),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

vi.mock('@/app/(details)/classifications/components/download-dialog/route-dialogs', () => ({
  DownloadVariantCodesRouteDialog: mocks.routeDialog,
}));

describe('VersionVariantDownloadPage', () => {
  it('renders the variant download dialog with parsed variant id', async () => {
    const { default: VersionVariantDownloadPage } = await import('./page');
    const element = await VersionVariantDownloadPage({ params: Promise.resolve({ variantId: '42' }) });

    render(element);

    expect(mocks.routeDialog).toHaveBeenCalledWith({ variantId: 42 }, undefined);
    expect(screen.getByTestId('variant-download-dialog')).toBeInTheDocument();
  });

  it('returns not found when variant id is invalid', async () => {
    const { default: VersionVariantDownloadPage } = await import('./page');

    await expect(VersionVariantDownloadPage({ params: Promise.resolve({ variantId: 'invalid' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });
});
