import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassification, mockSubjectFields } from '@/stories/fixtures';
import { ClassificationSearchHit } from './classificationSearchHit';

const meta = {
  title: 'Feature/Classifications/ClassificationSearchHit',
  component: ClassificationSearchHit,
  args: {
    classification: mockClassification,
    subjectFields: mockSubjectFields,
  },
} satisfies Meta<typeof ClassificationSearchHit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FallbackLanguage: Story = { args: { classification: { ...mockClassification, fallbackLanguage: 'nn' } } };
