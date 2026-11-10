import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { CopyTag } from './index';

type CopyType = NonNullable<ComponentProps<typeof CopyTag>['copyType']>;
type CopySize = NonNullable<ComponentProps<typeof CopyTag>['size']>;

const copyTypes = ['short_name', 'id', 'file_path'] satisfies readonly CopyType[];
const copySizes = ['md', 'lg'] satisfies readonly CopySize[];

const meta = {
  title: 'Components/CopyTag',
  component: CopyTag,
  args: {
    text: 'EMPLOYMENT_STATUS',
    copyType: 'short_name',
    size: 'md',
  },
  argTypes: {
    copyType: {
      control: 'select',
      options: copyTypes,
    },
    size: {
      control: 'select',
      options: copySizes,
    },
  },
} satisfies Meta<typeof CopyTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortNameMedium: Story = { args: { copyType: 'short_name', size: 'md' } };
export const ShortNameLarge: Story = { args: { copyType: 'short_name', size: 'lg' } };
export const IdMedium: Story = { args: { copyType: 'id', size: 'md' } };
export const IdLarge: Story = { args: { copyType: 'id', size: 'lg' } };
export const FilePathMedium: Story = { args: { copyType: 'file_path', size: 'md' } };
export const FilePathLarge: Story = { args: { copyType: 'file_path', size: 'lg' } };
