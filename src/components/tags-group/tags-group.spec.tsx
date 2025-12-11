'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import TagsGroup from '.';

jest.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Label: passthrough('label'),
    Paragraph: passthrough('p'),
    Link: passthrough('a'),
    Tag: passthrough('span'),
  };
});

describe('TagsGroup', () => {
  it('limits number of tags displayed', () => {
    const numTags = 1;
    render(
      <dl>
        <TagsGroup
          maxTags={numTags}
          tagData={
            new Map([
              ['0', '0'],
              ['1', '1'],
            ])
          }
        />
      </dl>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(numTags);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
  it("doesn't limit number of tags displayed", () => {
    const numTags = 3;
    render(
      <dl>
        <TagsGroup
          maxTags={numTags}
          tagData={
            new Map([
              ['0', '0'],
              ['1', '1'],
            ])
          }
        />
      </dl>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  it("doesn't allow duplicates", () => {
    const numTags = 3;
    render(
      <dl>
        <TagsGroup
          maxTags={numTags}
          tagData={
            new Map([
              ['0', '0'],
              ['0', '0'],
            ])
          }
        />
      </dl>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
