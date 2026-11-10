import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDatasetVariable } from '@/stories/fixtures';
import DatasetVariableCard from './DatasetVariableCard';

const meta = {
  title: 'Feature/DataProducts/DatasetVariableCard',
  component: DatasetVariableCard,
  args: {
    variable: mockDatasetVariable,
  },
} satisfies Meta<typeof DatasetVariableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTypes: Story = {};
export const MissingTypes: Story = {
  args: { variable: { ...mockDatasetVariable, physical_type: null, logical_type: null } },
};
export const PhysicalTypeOnly: Story = {
  args: { variable: { ...mockDatasetVariable, physical_type: 'INT32', logical_type: null } },
};
