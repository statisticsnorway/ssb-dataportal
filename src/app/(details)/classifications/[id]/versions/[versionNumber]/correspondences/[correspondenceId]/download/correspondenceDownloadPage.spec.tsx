import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  routeDialog: vi.fn(() => <div data-testid='correspondence-download-dialog' />),
  correspondencePage: vi.fn(() => <div data-testid='correspondence-page' />),
}));

vi.mock('@/app/(details)/classifications/components/download-dialog/route-dialogs', () => ({
  DownloadCorrespondenceRouteDialog: mocks.routeDialog,
}));

vi.mock('../page', () => ({
  default: mocks.correspondencePage,
}));

describe('Version-pinned CorrespondenceDownloadPage', () => {
  it('renders the correspondence page behind the download dialog', async () => {
    const { default: CorrespondenceDownloadPage } = await import('./page');
    const params = Promise.resolve({ id: '91', versionNumber: '1698', correspondenceId: '1253' });

    render(<CorrespondenceDownloadPage params={params} />);

    expect(screen.getByTestId('correspondence-page')).toBeInTheDocument();
    expect(screen.getByTestId('correspondence-download-dialog')).toBeInTheDocument();
  });

  it('passes the route params through to the correspondence page', async () => {
    const { default: CorrespondenceDownloadPage } = await import('./page');
    const params = Promise.resolve({ id: '91', versionNumber: '1698', correspondenceId: '1253' });

    render(<CorrespondenceDownloadPage params={params} />);

    expect(mocks.correspondencePage).toHaveBeenCalledWith({ params }, undefined);
  });
});
