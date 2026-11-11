import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CorrespondencesView from '@/app/(details)/classifications/components/views/CorrespondencesView';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';

const classificationId = 104;

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

const versionWithChangeTable: ClassificationVersionResource = {
  correspondenceTables: [
    {
      id: 2919,
      name: 'Næringsgruppering 2025 - Næringsgruppering 2007',
      changeTable: true,
    },
  ],
};

describe('CorrespondencesView', () => {
  it('shows informational alert when correspondences are missing', () => {
    render(<CorrespondencesView classificationId={classificationId} classificationVersion={{}} />);
    expect(screen.getByRole('status')).toHaveTextContent(localization.classification.correspondence.none);
  });
  it('shows informational alert when correspondences are empty', () => {
    render(
      <CorrespondencesView classificationId={classificationId} classificationVersion={versionWithoutCorrespondences} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(localization.classification.correspondence.none);
  });
  it('renders the correspondence table in a card', () => {
    render(
      <CorrespondencesView classificationId={classificationId} classificationVersion={versionWithOneCorrespondence} />,
    );
    expect(screen.getByRole('heading', { name: localization.classification.correspondence.heading })).toBeVisible();
    expect(screen.getByText('Korrespondansetabeller viser sammenhengen mellom to ulike kodeverk.')).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Korrespondansetabell' })).toBeVisible();
    expect(screen.getByText(localization.from)).toBeVisible();
    expect(screen.getByText('Kommuneinndeling 2026')).toBeVisible();
    expect(screen.getAllByText(localization.classification.correspondence.fromLevel)).toHaveLength(2);
    expect(screen.getAllByText('Alle')).toHaveLength(2);
    expect(screen.getByText(localization.to)).toBeVisible();
    expect(screen.getByText('Delområde- og grunnkretsinndeling 2026')).toBeVisible();
    expect(screen.getByText(localization.classification.correspondence.owner)).toBeVisible();
    expect(screen.getByText('320')).toBeVisible();
  });
  it('renders multiple correspondence tables in cards', () => {
    render(
      <CorrespondencesView classificationId={classificationId} classificationVersion={varsionWithTwoCorrespondences} />,
    );
    expect(screen.getByRole('heading', { name: localization.classification.correspondence.heading })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Korrespondansetabell 1' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 3, name: 'Korrespondansetabell 2' })).toBeVisible();
  });
  it('does not render change tables as correspondences', () => {
    render(<CorrespondencesView classificationId={classificationId} classificationVersion={versionWithChangeTable} />);

    expect(screen.getByRole('status')).toHaveTextContent(localization.classification.correspondence.none);
    expect(screen.queryByText('Næringsgruppering 2025 - Næringsgruppering 2007')).not.toBeInTheDocument();
  });

  describe('card links', () => {
    it('links without a version segment when no version id is given', () => {
      render(
        <CorrespondencesView
          classificationId={classificationId}
          classificationVersion={versionWithOneCorrespondence}
        />,
      );

      expect(screen.getByRole('link', { name: /Korrespondansetabell/ })).toHaveAttribute(
        'href',
        `/classifications/${classificationId}/correspondences/1506`,
      );
    });

    it('keeps the version segment when a version id is given', () => {
      render(
        <CorrespondencesView
          classificationId={classificationId}
          classificationVersion={versionWithOneCorrespondence}
          versionId={2345}
        />,
      );

      expect(screen.getByRole('link', { name: /Korrespondansetabell/ })).toHaveAttribute(
        'href',
        `/classifications/${classificationId}/versions/2345/correspondences/1506`,
      );
    });

    it('ignores the version on the resource so links follow the default version', () => {
      render(
        <CorrespondencesView
          classificationId={classificationId}
          classificationVersion={{ ...versionWithOneCorrespondence, id: 999 }}
        />,
      );

      expect(screen.getByRole('link', { name: /Korrespondansetabell/ })).toHaveAttribute(
        'href',
        `/classifications/${classificationId}/correspondences/1506`,
      );
    });
  });
});
