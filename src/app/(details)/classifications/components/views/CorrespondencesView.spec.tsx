import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CorrespondencesView from '@/app/(details)/classifications/components/views/CorrespondencesView';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';

const versionWithoutCorrespondences: ClassificationVersionResource = {
  correspondenceTables: [],
};

const versionWithOneCorrespondence: ClassificationVersionResource = {
  correspondenceTables: [
    {
      id: 1506,
      name: 'Korrespondansetabell',
      source: 'Kommuneinndeling 2026',
      sourceLevel: { levelName: 'Alle' },
      target: 'Delområde- og grunnkretsinndeling 2026',
      targetLevel: { levelName: 'Alle' },
      owningSection: '320',
    },
  ],
};

const varsionWithTwoCorrespondences: ClassificationVersionResource = {
  correspondenceTables: [
    {
      id: 1800,
      name: 'Korrespondansetabell 1',
    },
    {
      id: 1801,
      name: 'Korrespondansetabell 2',
    },
  ],
};

describe('CorrespondencesView', () => {
  it('shows informational alert when correspondences are missing', () => {
    render(<CorrespondencesView classificationVersion={{}} />);
    expect(screen.getByRole('status')).toHaveTextContent(localization.classification.correspondence.none);
  });
  it('shows informational alert when correspondences are empty', () => {
    render(<CorrespondencesView classificationVersion={versionWithoutCorrespondences} />);
    expect(screen.getByRole('status')).toHaveTextContent(localization.classification.correspondence.none);
  });
  it('renders the correspondence table in a card', () => {
    render(<CorrespondencesView classificationVersion={versionWithOneCorrespondence} />);
    expect(screen.getByRole('heading', { name: localization.classification.correspondence.heading })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Korrespondansetabell' })).toBeVisible();
    expect(screen.getByText(localization.classification.correspondence.from)).toBeVisible();
    expect(screen.getByText('Kommuneinndeling 2026')).toBeVisible();
    expect(screen.getAllByText(localization.classification.correspondence.fromLevel)).toHaveLength(2);
    expect(screen.getAllByText('Alle')).toHaveLength(2);
    expect(screen.getByText(localization.classification.correspondence.to)).toBeVisible();
    expect(screen.getByText('Delområde- og grunnkretsinndeling 2026')).toBeVisible();
    expect(screen.getByText(localization.classification.correspondence.owner)).toBeVisible();
    expect(screen.getByText('320')).toBeVisible();
  });
  it('renders multiple correspondence tables in cards', () => {
    render(<CorrespondencesView classificationVersion={varsionWithTwoCorrespondences} />);
    expect(screen.getByRole('heading', { name: localization.classification.correspondence.heading })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Korrespondansetabell 1' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Korrespondansetabell 2' })).toBeVisible();
  });
});
