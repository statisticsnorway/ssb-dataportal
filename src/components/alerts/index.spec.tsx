'use client';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { JSX } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClosableAlert } from '.';

const { getCookieValueMock, setPreferenceCookieMock } = vi.hoisted(() => {
  return {
    getCookieValueMock: vi.fn(),
    setPreferenceCookieMock: vi.fn(),
  };
});

vi.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Alert: passthrough('section'),
    Button: passthrough('button'),
    Heading: passthrough('h2'),
    Paragraph: passthrough('p'),
  };
});

vi.mock('@/libs/language', () => ({
  localization: {
    close: 'Close',
  },
  getCookieValue: getCookieValueMock,
  setPreferenceCookie: setPreferenceCookieMock,
}));

describe('ClosableAlert', () => {
  beforeEach(() => {
    getCookieValueMock.mockReset();
    setPreferenceCookieMock.mockReset();
  });

  it('renders heading, message and extra content without persistence', () => {
    render(
      <ClosableAlert
        heading='Migration heading'
        message='Migration info'
        extraContent={<a href='https://example.com'>Read more</a>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Migration heading' })).toBeInTheDocument();
    expect(screen.getByText('Migration info')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read more' })).toBeInTheDocument();
    expect(getCookieValueMock).not.toHaveBeenCalled();
  });

  it('does not render when dismissal cookie is already set', async () => {
    getCookieValueMock.mockReturnValue('true');

    render(
      <ClosableAlert
        heading='Migration heading'
        message='Migration info'
        persistDismissalCookieName='test-dismiss-cookie'
      />,
    );

    await waitFor(() => {
      expect(getCookieValueMock).toHaveBeenCalledWith('test-dismiss-cookie');
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('stores dismissal cookie when closed', async () => {
    getCookieValueMock.mockReturnValue(undefined);
    const onClose = vi.fn();

    render(
      <ClosableAlert
        heading='Migration heading'
        message='Migration info'
        persistDismissalCookieName='test-dismiss-cookie'
        onClose={onClose}
      />,
    );

    const closeButton = await screen.findByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);

    expect(setPreferenceCookieMock).toHaveBeenCalledWith('test-dismiss-cookie', 'true');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
