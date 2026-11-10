import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDatasetVariables } from '@/stories/fixtures';
import DatasetVariableList from './DatasetVariableList';

const meta = {
  title: 'Feature/DataProducts/DatasetVariableList',
  component: DatasetVariableList,
  args: {
    variables: mockDatasetVariables.slice(0, 6),
  },
} satisfies Meta<typeof DatasetVariableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithVariables: Story = {};
export const Empty: Story = { args: { variables: [] } };
