import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StoryAuthProvider } from '@/stories/providers';
import { ApiDocLink } from './apiDocLink';

const meta = {
  title: 'Components/ApiDocLink',
  component: ApiDocLink,
  args: {
    href: 'https://example.com/api-docs',
  },
} satisfies Meta<typeof ApiDocLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Public: Story = {
  decorators: [
    (Story) => (
      <StoryAuthProvider>
        <Story />
      </StoryAuthProvider>
    ),
  ],
};
export const Authenticated: Story = {
  decorators: [
    (Story) => (
      <StoryAuthProvider isAuthenticated>
        <Story />
      </StoryAuthProvider>
    ),
  ],
};
