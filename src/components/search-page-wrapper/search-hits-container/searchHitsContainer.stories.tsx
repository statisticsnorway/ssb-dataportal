import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { SearchHit } from '@/components/search-hit';
import { SearchHitContainer } from './index';

type Hit = { id: string; title: string; description: string };

const hits: Hit[] = [
  { id: 'employment-status', title: 'Employment status', description: 'Relationship to the labour market.' },
  { id: 'education-level', title: 'Education level', description: 'Highest completed level of education.' },
  { id: 'population', title: 'Population', description: 'People registered as residents.' },
];

const renderHit = (hit: unknown): ReactNode => {
  const item = hit as Hit;
  return <SearchHit key={item.id} title={item.title} description={item.description} />;
};

const meta = {
  title: 'Components/SearchHitContainer',
  component: SearchHitContainer,
  args: {
    ariaLabel: 'Search results',
    searchHits: hits,
    onPageChange: fn(),
    noSearchHits: false,
    renderHit,
  },
} satisfies Meta<typeof SearchHitContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Results: Story = {};
export const Paginated: Story = { args: { paginationInfo: { currentPage: 1, totalPages: 4 } } };
export const NoResults: Story = { args: { searchHits: [], noSearchHits: true } };
