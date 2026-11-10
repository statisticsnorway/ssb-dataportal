import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockVariables } from '@/stories/fixtures';
import { ValidityPeriodSelector } from './validityPeriodSelector';

const validityPeriods = mockVariables.filter((variable) => variable.id === mockVariables[0]?.id);

const meta = {
  title: 'Feature/VariableDefinitions/ValidityPeriodSelector',
  component: ValidityPeriodSelector,
  args: {
    validityPeriods,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/variable-definitions/aksje',
      },
    },
  },
} satisfies Meta<typeof ValidityPeriodSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiplePeriods: Story = {};
export const SinglePeriod: Story = { args: { validityPeriods: validityPeriods.slice(0, 1) } };
