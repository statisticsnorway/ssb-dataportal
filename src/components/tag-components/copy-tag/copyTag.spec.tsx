/** biome-ignore-all lint/suspicious/noExplicitAny: <necessary for testing> */
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CopyTag } from '.';

const copyToClipboardMock = vi.fn();

vi.mock('@/hooks/useClipboard', () => ({
  useClipboard: () => ({
    copied: false,
    copyToClipboard: copyToClipboardMock,
  }),
}));

vi.mock('@/libs/language/src/localization', () => ({
  localization: {
    copy: {
      shortName: 'Copy short name',
      id: 'Copy id',
      copied: 'Copied',
    },
    variableDefinition: {
      id: 'ID',
      shortName: 'Short name',
    },
  },
}));

vi.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: any) =>
      React.createElement(tag, props, children);

  return {
    Button: passthrough('button'),
    Tag: passthrough('div'),
    Tooltip: passthrough('div'),
  };
});

vi.mock('@navikt/aksel-icons', () => ({
  FilesIcon: () => 'span',
}));

describe('CopyTag', () => {
  it('renders text', () => {
    render(<CopyTag text='hello' />);

    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('uses short_name label as default', () => {
    render(<CopyTag text='hello' />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Copy short name');

    button.click();

    expect(copyToClipboardMock).toHaveBeenCalledWith('hello');
  });

  it('uses id labels correctly', () => {
    render(<CopyTag text='hello' copyType='id' />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Copy id');

    button.click();

    expect(copyToClipboardMock).toHaveBeenCalledWith('hello');
  });
});
