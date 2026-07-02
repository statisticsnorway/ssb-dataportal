import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { postSubscriber } from '@/libs/data/classifications/classificationData';
import { localization } from '@/libs/language/src/localization';
import { SubscribeStatus, ValidationMessageColors } from '@/types/subscription'; // adjust path
import { SubscribeDialog } from './index';

vi.mock('@/libs/data/classifications/classificationData', () => ({
  postSubscriber: vi.fn(),
}));

vi.mock('@/libs/logger/client-logger', () => ({
  clientLogger: { info: vi.fn(), error: vi.fn() },
}));

describe('SubscribeDialog', () => {
  it('renders the trigger button', () => {
    render(<SubscribeDialog classificationId={1} />);
    expect(screen.getByText(localization.classification.subscribe)).toBeInTheDocument();
  });

  it('shows email input and submit button after opening dialog', async () => {
    const user = userEvent.setup();
    render(<SubscribeDialog classificationId={1} />);

    await user.click(screen.getByText(localization.classification.subscribe));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: localization.classification.subscribe })).toBeInTheDocument();
  });

  it('shows invalid email message when submitting bad email', async () => {
    const user = userEvent.setup();
    render(<SubscribeDialog classificationId={1} />);

    await user.click(screen.getByText(localization.classification.subscribe));
    await user.type(screen.getByRole('textbox'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: "subscribe-button"  }));

    expect(screen.getByText(localization.classification.subscribeMessageInvalidEmail)).toBeInTheDocument();
  });

  it('shows success message after valid email submission', async () => {
    const user = userEvent.setup();
    vi.mocked(postSubscriber).mockResolvedValue({
      code: SubscribeStatus.Created,
      message: 'Du er nå abonnent',
      dataColor: ValidationMessageColors.Success,
    });

    render(<SubscribeDialog classificationId={1} />);

    await user.click(screen.getByText(localization.classification.subscribe));
    await user.type(screen.getByRole('textbox'), 'test@ssb.no');
    await user.click(screen.getByRole('button', { name: localization.classification.subscribe }));

    await waitFor(() => {
      expect(screen.getByText('Du er nå abonnent')).toBeInTheDocument();
    });
  });

  it('shows already subscribed message when email exists', async () => {
    const user = userEvent.setup();
    vi.mocked(postSubscriber).mockResolvedValue({
      code: SubscribeStatus.Exists,
      message: 'Du er allerede abonnent',
      dataColor: ValidationMessageColors.Warning,
    });

    render(<SubscribeDialog classificationId={1} />);

    await user.click(screen.getByText(localization.classification.subscribe));
    await user.type(screen.getByRole('textbox'), 'existing@ssb.no');
    await user.click(screen.getByRole('button', { name: localization.classification.subscribe }));

    await waitFor(() => {
      expect(screen.getByText('Du er allerede abonnent')).toBeInTheDocument();
    });
  });

  it('shows error message when API returns error', async () => {
    const user = userEvent.setup();
    vi.mocked(postSubscriber).mockResolvedValue({
      code: SubscribeStatus.Error,
      message: 'Noe gikk galt',
      dataColor: ValidationMessageColors.Danger,
    });

    render(<SubscribeDialog classificationId={1} />);

    await user.click(screen.getByText(localization.classification.subscribe));
    await user.type(screen.getByRole('textbox'), 'test@ssb.no');
    await user.click(screen.getByRole('button', { name: localization.classification.subscribe }));

    await waitFor(() => {
      expect(screen.getByText('Noe gikk galt')).toBeInTheDocument();
    });
  });

  it('hides input and submit button after successful subscription', async () => {
    const user = userEvent.setup();
    vi.mocked(postSubscriber).mockResolvedValue({
      code: SubscribeStatus.Created,
      message: 'Du er nå abonnent',
      dataColor: ValidationMessageColors.Success,
    });

    render(<SubscribeDialog classificationId={1} />);

    await user.click(screen.getByText(localization.classification.subscribe));
    await user.type(screen.getByRole('textbox'), 'test@ssb.no');
    await user.click(screen.getByRole('button', { name: localization.classification.subscribe }));

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: localization.classification.subscribe })).not.toBeInTheDocument();
    });
  });
});
