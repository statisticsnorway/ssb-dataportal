import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SubjectFiltersSectionFallback } from './SubjectFiltersSection';

const meta = {
  title: 'Feature/DataProducts/SubjectFiltersSectionFallback',
  component: SubjectFiltersSectionFallback,
} satisfies Meta<typeof SubjectFiltersSectionFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};
