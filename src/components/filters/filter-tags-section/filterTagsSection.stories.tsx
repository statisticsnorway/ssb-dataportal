import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import type { FilterItem } from '@/types/filters';
import { FilterTagsSection } from './index';

const tags: FilterItem[] = [
  { value: 'published', label: 'Published' },
  { value: 'labour', label: 'Labour market' },
];

const meta = {
  title: 'Components/FilterTagsSection',
  component: FilterTagsSection,
  args: {
    tags,
    onRemoveTag: fn(),
    onClearAll: fn(),
  },
} satisfies Meta<typeof FilterTagsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectedTags: Story = {};
export const SearchAndTags: Story = {
  args: { searchTerm: 'employment', onClearSearch: fn() },
};
export const SearchOnly: Story = {
  args: { tags: [], searchTerm: 'employment', onClearSearch: fn() },
};
