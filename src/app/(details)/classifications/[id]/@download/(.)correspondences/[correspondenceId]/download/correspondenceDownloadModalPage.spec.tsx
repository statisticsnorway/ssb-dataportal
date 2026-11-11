import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  routeDialog: vi.fn(() => <div data-testid='correspondence-download-dialog' />),
}));

vi.mock('@/app/(details)/classifications/components/download-dialog/route-dialogs', () => ({
  DownloadCorrespondenceRouteDialog: mocks.routeDialog,
}));

describe('CorrespondenceDownloadModalPage', () => {
  it('renders only the dialog, so the intercepted page stays behind it', async () => {
    const { default: CorrespondenceDownloadModalPage } = await import('./page');

    const { container } = render(<CorrespondenceDownloadModalPage />);

    expect(screen.getByTestId('correspondence-download-dialog')).toBeInTheDocument();
    expect(container.childElementCount).toBe(1);
  });
});
