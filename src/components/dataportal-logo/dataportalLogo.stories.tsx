import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { DataportalLogo } from './index';

type LogoProps = ComponentProps<typeof DataportalLogo>;

const meta = {
  title: 'Components/DataportalLogo',
  component: DataportalLogo,
  args: {
    title: 'Metadata catalog',
    placement: 'header',
  },
  argTypes: {
    negative: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof DataportalLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

const negativeBackground = (Story: () => React.JSX.Element) => (
  <div style={{ padding: '1rem', backgroundColor: 'var(--ssb-dark-color-5)' }}>
    <Story />
  </div>
);

export const PositiveLinked: Story = { args: { ...({ homeUrl: '/' } satisfies Partial<LogoProps>), negative: false } };
export const PositiveStatic: Story = { args: { homeUrl: undefined, negative: false } };
export const NegativeLinked: Story = {
  args: { homeUrl: '/', negative: true, placement: 'footer' },
  decorators: [negativeBackground],
};
export const NegativeStatic: Story = {
  args: { homeUrl: undefined, negative: true, placement: 'footer' },
  decorators: [negativeBackground],
};
