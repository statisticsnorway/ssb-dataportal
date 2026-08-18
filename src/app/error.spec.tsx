import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/error';
import { localization } from '@/libs/language';

describe('ErrorPage', () => {
  it('uses reset for retry action', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorPage error={new Error('Boom')} reset={reset} />);
    await user.click(screen.getByRole('button', { name: localization.error.reloadPage }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
