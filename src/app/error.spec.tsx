import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/error';
import { localization } from '@/libs/language';

describe('ErrorPage', () => {
  it('uses unstable_retry for retry action', async () => {
    const user = userEvent.setup();
    const unstable_retry = vi.fn();
    render(<ErrorPage error={new Error('Boom')} unstable_retry={unstable_retry} />);
    await user.click(screen.getByRole('button', { name: localization.error.reloadPage }));
    expect(unstable_retry).toHaveBeenCalledTimes(1);
  });
});
