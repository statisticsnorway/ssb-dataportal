import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ClassificationVersionResource } from '@/libs/data-access/klass';
import CorrespondencesView from './CorrespondencesView';

const version: ClassificationVersionResource = {
  id: 363,
  correspondenceTables: [
    {
      id: 1506,
      name: 'Landkoder 2011 - Landkoder 2009',
      source: 'Landkoder 2011',
      target: 'Landkoder 2009',
      sourceLevel: { levelNumber: 1, levelName: 'Alle' },
      targetLevel: { levelNumber: 1, levelName: 'Alle' },
      owningSection: '320',
      changeTable: true,
    },
  ],
};

describe('CorrespondencesView', () => {
  it('renders correspondence table summaries', () => {
    render(<CorrespondencesView classificationId={1} version={version} isLatest={true} />);

    expect(screen.getByRole('heading', { name: 'Korrespondanser' })).toBeInTheDocument();
    expect(screen.getByText('Landkoder 2011 - Landkoder 2009')).toBeInTheDocument();
    expect(screen.getByText('Landkoder 2011')).toBeInTheDocument();
    expect(screen.getByText('Landkoder 2009')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
    expect(screen.getByText('Eier')).toBeInTheDocument();
    expect(screen.getAllByText('Alle')).toHaveLength(2);
    expect(screen.getAllByText('Nivå')).toHaveLength(2);
    expect(screen.queryByText('1506')).not.toBeInTheDocument();
  });

  it('renders an empty state when the version has no correspondence tables', () => {
    render(<CorrespondencesView classificationId={1} version={{ id: 1, correspondenceTables: [] }} isLatest={true} />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Det finnes ingen korrespondansetabeller for denne versjonen.',
    );
  });
});
