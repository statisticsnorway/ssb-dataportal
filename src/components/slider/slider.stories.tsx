import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';
import { Slider } from './index';

type SliderProps = ComponentProps<typeof Slider>;

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    'aria-label': 'Selected period range',
    value: [20, 80],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
  render: (args) => (
    <>
      {args['aria-labelledby'] ? <span id={args['aria-labelledby']}>Selected period range</span> : null}
      <Slider {...args} />
    </>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = { args: { disabled: false } };
export const Disabled: Story = { args: { disabled: true } };
export const LabelledBy: Story = {
  args: {
    'aria-label': undefined,
    'aria-labelledby': 'slider-label',
  } satisfies Partial<SliderProps>,
};
export const DisabledAndLabelledBy: Story = {
  args: {
    'aria-label': undefined,
    'aria-labelledby': 'slider-label',
    disabled: true,
  } satisfies Partial<SliderProps>,
};
