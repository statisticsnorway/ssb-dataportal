import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import type { SupportedLanguage } from '@/libs/language';
import { SearchHit } from './index';

const languages = ['nb', 'nn', 'en'] satisfies readonly SupportedLanguage[];

const meta = {
  title: 'Components/SearchHit',
  component: SearchHit,
  args: {
    title: 'Employment status',
    href: '/variable-definitions/employment-status',
    description: 'A person’s relationship to the labour market.',
    tagsList: 'Labour market',
  },
  argTypes: {
    fallbackLanguage: {
      control: 'select',
      options: languages,
    },
  },
} satisfies Meta<typeof SearchHit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FallbackLanguage: Story = {
  args: { fallbackLanguage: 'nn' satisfies ComponentProps<typeof SearchHit>['fallbackLanguage'] },
};
