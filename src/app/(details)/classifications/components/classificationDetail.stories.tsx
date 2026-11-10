import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockClassification, mockClassificationVersion } from '@/stories/fixtures';
import { StoryAuthProvider } from '@/stories/providers';
import ClassificationDetail from './classificationDetail';
import DetailsView from './views/DetailsView';

const meta = {
  title: 'Feature/Classifications/ClassificationDetail',
  component: ClassificationDetail,
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
  decorators: [
    (Story) => (
      <StoryAuthProvider isAuthenticated>
        <Story />
      </StoryAuthProvider>
    ),
  ],
} satisfies Meta<typeof ClassificationDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Detail: Story = {};
