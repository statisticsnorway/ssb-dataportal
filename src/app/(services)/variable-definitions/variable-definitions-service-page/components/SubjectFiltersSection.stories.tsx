import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { mockSubjectFieldsPromise, mockVariableDefinitionsPromise } from '@/stories/fixtures';
import { SubjectFiltersSection } from './SubjectFiltersSection';

const meta = {
  title: 'Feature/VariableDefinitions/SubjectFiltersSection',
  component: SubjectFiltersSection,
  args: {
    subjectFieldsPromise: mockSubjectFieldsPromise,
    variablesPromise: mockVariableDefinitionsPromise,
    selectedItems: [],
    onFilterChange: fn(),
  },
} satisfies Meta<typeof SubjectFiltersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoSubjectSelected: Story = {};
export const SubjectSelected: Story = {
  args: { selectedItems: [{ value: 'bf', label: 'Bank og finansmarked' }] },
};
