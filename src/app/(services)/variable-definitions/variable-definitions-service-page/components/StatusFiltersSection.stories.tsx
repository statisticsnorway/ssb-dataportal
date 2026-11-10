import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { mockVariableDefinitionsPromise } from '@/stories/fixtures';
import { StatusFiltersSection } from './StatusFiltersSection';

const meta = {
  title: 'Feature/VariableDefinitions/StatusFiltersSection',
  component: StatusFiltersSection,
  args: {
    variablesPromise: mockVariableDefinitionsPromise,
    selectedItems: [],
    onFilterChange: fn(),
  },
} satisfies Meta<typeof StatusFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoStatusSelected: Story = {};
export const PublishedSelected: Story = {
  args: { selectedItems: [{ value: 'PUBLISHED_EXTERNAL', label: 'Published externally' }] },
};
