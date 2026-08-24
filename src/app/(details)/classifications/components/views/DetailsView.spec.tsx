import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import classificationMock from '@/static-data/classifications.json';
import versionsMock from '@/static-data/versions.json';
import DetailsView from './DetailsView';

const baseClassification = {
  ...(classificationMock.classifications[0] as unknown as ClassificationWithLanguage),
  fallbackLanguage: undefined,
} as ClassificationWithLanguage;
const baseVersion = versionsMock.versions[0] as unknown as ClassificationVersionResource;

describe('DetailsView', () => {
  it('renders the DetailsView component', () => {
    const { container } = render(
      <DetailsView classification={baseClassification} classificationVersion={baseVersion} />,
    );

    const dl = container.querySelector('dl');
    expect(dl).not.toBeNull();

    const dts = within(dl as HTMLElement).getAllByRole('term');
    const dds = within(dl as HTMLElement).getAllByRole('definition');

    expect(dts.length).toBeGreaterThan(0);
    expect(dts).toHaveLength(dds.length);
  });
  it('no content for item', () => {
    const sparseVersion = {
      ...baseVersion,
      introduction: '',
      legalBase: '',
      publications: '',
      derivedFrom: '',
      contactPerson: undefined,
    } as unknown as ClassificationVersionResource;

    render(<DetailsView classification={baseClassification} classificationVersion={sparseVersion} />);

    expect(screen.getAllByText(/—/i).length).toBeGreaterThan(0);
  });
  it('sets correct language in html when using fallback language', () => {
    const classification: ClassificationWithLanguage = {
      ...baseClassification,
      fallbackLanguage: 'en',
    };

    const { container } = render(<DetailsView classification={classification} classificationVersion={baseVersion} />);

    expect(container.querySelector('[lang="en"]')).not.toBeNull();
  });
});
