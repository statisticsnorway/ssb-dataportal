import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  mockClassificationsPromise,
  mockMatchingSearchResultsPromise,
  mockSubjectFieldsPromise,
} from '@/stories/fixtures';
import { StoryNuqsProvider } from '@/stories/providers';
import ClassificationsServicePage from './index';

const meta = {
  title: 'Feature/Classifications/ClassificationsServicePage',
  component: ClassificationsServicePage,
  args: {
    classificationsPromise: mockClassificationsPromise,
    subjectFieldsPromise: mockSubjectFieldsPromise,
    searchResultPromise: mockMatchingSearchResultsPromise,
    isSearchActive: false,
    language: 'nb',
  },
  decorators: [
    (Story) => (
      <StoryNuqsProvider>
        <Story />
      </StoryNuqsProvider>
    ),
  ],
} satisfies Meta<typeof ClassificationsServicePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Browse: Story = {};
export const SearchResults: Story = { args: { isSearchActive: true } };
