import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { VariableStatus } from '@/libs/data-access/variable-definitions/internal';
import { StatusTag } from './statusTag';

type Status = ComponentProps<typeof StatusTag>['variableStatus'];

const statuses = Object.values(VariableStatus) satisfies Status[];

const meta = {
  title: 'Components/StatusTag',
  component: StatusTag,
  args: {
    variableStatus: VariableStatus.Draft,
  },
  argTypes: {
    variableStatus: {
      control: 'select',
      options: statuses,
    },
  },
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = { args: { variableStatus: VariableStatus.Draft } };
export const PublishedInternal: Story = { args: { variableStatus: VariableStatus.PublishedInternal } };
export const PublishedExternal: Story = { args: { variableStatus: VariableStatus.PublishedExternal } };
