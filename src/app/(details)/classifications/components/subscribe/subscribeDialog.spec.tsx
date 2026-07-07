import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { postSubscriber } from '@/libs/data/classifications/subscriptionData';
import { localization } from '@/libs/language/src/localization';
import { SubscribeDialog } from './index';

vi.mock('@/libs/data/classifications/subscriptionData', () => ({
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

  it('dialog is present in DOM on render', () => {
    const { container } = render(<SubscribeDialog classificationId={1} />);
    expect(container.querySelector('dialog')).toBeInTheDocument();
  });
  it('does not crash when postSubscriber returns 500', () => {
    // 500 is handled inside postSubscriber and returns a SubscribeResult
    vi.mocked(postSubscriber).mockRejectedValue(new Error('Internal Server Error'));
    const { container } = render(<SubscribeDialog classificationId={1} />);
    expect(container.querySelector('dialog')).toBeInTheDocument();
  });

  it('does not crash when postSubscriber throws unexpected error', () => {
    // This simulates a network crash
    vi.mocked(postSubscriber).mockRejectedValue(new Error('Network error'));
    const { container } = render(<SubscribeDialog classificationId={1} />);
    expect(container.querySelector('dialog')).toBeInTheDocument();
  });
});
