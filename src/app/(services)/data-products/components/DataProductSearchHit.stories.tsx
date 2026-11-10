import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockDataProduct, mockSubjectFields } from '@/stories/fixtures';
import { DataProductSearchHit } from './DataProductSearchHit';

const meta = {
  title: 'Feature/DataProducts/DataProductSearchHit',
  component: DataProductSearchHit,
  args: {
    dataProduct: mockDataProduct,
    subjectFields: mockSubjectFields,
  },
} satisfies Meta<typeof DataProductSearchHit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatisticProduct: Story = {};
export const WithoutSubjectField: Story = { args: { subjectFields: [] } };
