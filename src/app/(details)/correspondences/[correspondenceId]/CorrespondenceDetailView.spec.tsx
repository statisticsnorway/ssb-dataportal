import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CorrespondenceTableResource } from '@/libs/data-access/klass';
import CorrespondenceDetailView from './CorrespondenceDetailView';

const table: CorrespondenceTableResource = {
  id: 1506,
  name: 'Landkoder 2011 - Landkoder 2009',
  source: 'Landkoder 2011',
  target: 'Landkoder 2009',
  owningSection: '320',
  correspondenceMaps: [
    { sourceCode: 'NO', sourceName: 'Norge', targetCode: 'NO', targetName: 'Norge' },
    { sourceCode: 'SE', sourceName: 'Sverige', targetCode: 'SE', targetName: 'Sverige' },
  ],
};

describe('CorrespondenceDetailView', () => {
  it('renders correspondence metadata and code mappings', () => {
    render(<CorrespondenceDetailView table={table} returnTo='/classifications/1/correspondences' />);

    expect(screen.getByRole('link', { name: /Til korrespondanser/ })).toHaveAttribute(
      'href',
      '/classifications/1/correspondences',
    );
    expect(screen.getByRole('heading', { name: table.name })).toBeInTheDocument();
    expect(screen.getAllByText('Norge')).toHaveLength(2);
    expect(screen.getAllByText('Sverige')).toHaveLength(2);
    for (const header of screen.getAllByRole('columnheader')) {
      expect(header).toHaveAttribute('scope', 'col');
    }
  });

  it('filters mappings by code or name', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(<CorrespondenceDetailView table={table} returnTo='/classifications' />);

    await user.type(screen.getByLabelText('Filtrer etter kode eller navn'), 'Sverige');

    expect(screen.getAllByText('Sverige')).toHaveLength(2);
    expect(screen.queryByText('Norge')).not.toBeInTheDocument();
  });
});
