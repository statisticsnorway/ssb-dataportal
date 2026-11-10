import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LanguageTag } from './index';

const meta = {
  title: 'Components/LanguageTag',
  component: LanguageTag,
  args: {
    title: 'Norsk bokmål',
  },
} satisfies Meta<typeof LanguageTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTooltip: Story = {};
export const CustomTooltip: Story = { args: { tooltipContent: 'Content available in Norwegian Bokmål.' } };
