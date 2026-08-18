import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import classificationMock from '@/static-data/classifications.json';
import versionsMock from '@/static-data/versions.json';
import DetailsView from './DetailsView';

const classification = classificationMock.classifications[0] as unknown as ClassificationResource;
const version = versionsMock.versions[0] as unknown as ClassificationVersionResource;

describe('DetailsView', () => {
  it('links variants without a version when none is selected explicitly', () => {
    render(<DetailsView classification={classification} classificationVersion={version} />);
  });
});
