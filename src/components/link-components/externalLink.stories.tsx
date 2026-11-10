import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { ExternalLink } from './externalLink';

type ExternalLinkProps = ComponentProps<typeof ExternalLink>;

const meta = {
  title: 'Components/ExternalLink',
  component: ExternalLink,
  args: {
    linkText: 'Statistics Norway',
    href: 'https://www.ssb.no',
    willOpenNewTab: false,
  },
  argTypes: {
    willOpenNewTab: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ExternalLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SameTab: Story = { args: { willOpenNewTab: false } };
export const NewTab: Story = { args: { willOpenNewTab: true } };

export const AccessibleLabel: Story = {
  args: { ariaLabel: 'Visit Statistics Norway', willOpenNewTab: false } satisfies Partial<ExternalLinkProps>,
};
