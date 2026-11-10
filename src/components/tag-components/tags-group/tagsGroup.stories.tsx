import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { TagsGroup } from './index';

type TagData = ComponentProps<typeof TagsGroup>['tagData'];

const tagData: TagData = new Map([
  ['subject-1', 'Labour market'],
  ['subject-2', 'Education'],
  ['subject-3', 'Population'],
]);

const meta = {
  title: 'Components/TagsGroup',
  component: TagsGroup,
  args: {
    tagData,
    ariaLabel: 'Subject areas',
  },
  argTypes: {
    maxTags: {
      control: 'number',
    },
    tagData: {
      control: false,
    },
  },
} satisfies Meta<typeof TagsGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTags: Story = {};
export const LimitedTags: Story = { args: { maxTags: 2 } };
export const Empty: Story = { args: { tagData: new Map() } };
