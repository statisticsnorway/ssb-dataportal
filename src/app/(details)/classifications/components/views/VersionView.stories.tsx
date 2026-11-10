import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassification, mockClassificationVersion } from '@/stories/fixtures';
import DetailsView from './DetailsView';
import { VersionView } from './VersionView';

const meta = {
  title: 'Feature/Classifications/VersionView',
  component: VersionView,
  args: {
    classification: mockClassification,
    classificationVersion: mockClassificationVersion,
    children: <DetailsView classification={mockClassification} classificationVersion={mockClassificationVersion} />,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/classifications/2003',
      },
    },
  },
} satisfies Meta<typeof VersionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentVersion: Story = {};
export const MissingLanguage: Story = { args: { missingInSelectedLanguage: true } };
