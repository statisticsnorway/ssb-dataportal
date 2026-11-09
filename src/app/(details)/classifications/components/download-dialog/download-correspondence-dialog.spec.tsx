/** biome-ignore-all lint/suspicious/noExplicitAny: Component mocks intentionally accept the library props loosely. */
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { localization } from '@/libs/language';

const downloadCorrespondenceAction = vi.fn(async () => ({ content: '', mimeType: 'text/csv' }));

vi.mock('./actions', () => ({
  downloadCodesAction: vi.fn(),
  downloadVariantCodesAction: vi.fn(),
  downloadChangesAction: vi.fn(),
  downloadCorrespondenceAction: (...args: unknown[]) => downloadCorrespondenceAction(...(args as [])),
}));

vi.mock('@digdir/designsystemet-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@digdir/designsystemet-react')>();
  return {
    ...actual,
    Dialog: Object.assign(({ children }: any) => <div>{children}</div>, {
      TriggerContext: ({ children }: any) => children,
    }),
  };
});

const { DownloadCorrespondenceDialog } = await import('./index');

function renderDialog(inverted: boolean) {
  return render(<DownloadCorrespondenceDialog tableId={1506} open={true} showTrigger={false} inverted={inverted} />);
}

describe('DownloadCorrespondenceDialog', () => {
  it('offers every format for the stored direction', () => {
    renderDialog(false);

    const options = screen.getAllByRole('option').map((option) => option.textContent);
    expect(options).toEqual(expect.arrayContaining(['CSV', 'XML', 'JSON']));
    expect(screen.queryByText(localization.classification.download.invertedOnlyCsv)).not.toBeInTheDocument();
  });

  it('restricts the inverted download to csv and explains why', () => {
    renderDialog(true);

    const formatSelect = screen.getByLabelText(localization.classification.download.formatLabel);
    const options = within(formatSelect)
      .getAllByRole('option')
      .map((option) => option.textContent);

    expect(options).toEqual(['CSV']);
    expect(screen.getByText(localization.classification.download.invertedOnlyCsv)).toBeVisible();
  });

  it('passes the direction to the server action', async () => {
    const user = userEvent.setup();
    renderDialog(true);

    await user.click(screen.getByRole('button', { name: localization.classification.download.confirm }));

    expect(downloadCorrespondenceAction).toHaveBeenCalledWith(
      expect.objectContaining({ tableId: 1506, format: 'csv', inverted: true }),
    );
  });
});
