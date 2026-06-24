import { describe, expect, it } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { ClassificationType } from '@/types/classification';
import { parseClassification } from './classificationHelpers';

describe('parseClassification', () => {
  const validJson = {
    name: 'Standard for delområde- og grunnkretsinndeling',
    id: 1,
    classificationType: 'Klassifikasjon',
    lastModified: '2025-12-03T10:05:55.000+0000',
    _links: {
      self: {
        href: 'https://data.ssb.no/api/klass/v1/classifications/1',
      },
    },
  };

  const invalidJson = {
    name: 'Standard for delområde- og grunnkretsinndeling',
    classificationType: 'Klassifikasjon',
    lastModified: '2025-12-03T10:05:55.000+0000',
    _links: {
      self: {
        href: 'https://data.ssb.no/api/klass/v1/classifications/1',
      },
    },
  };
  it('returns a parsed classification when given valid input', () => {
    const result = parseClassification(validJson);

    const expected: ClassificationResource = {
      id: validJson.id,
      name: validJson.name,
      classificationType: ClassificationType[validJson.classificationType as keyof typeof ClassificationType],
      lastModified: new Date(validJson.lastModified),
      links: validJson._links,
    };

    expect(result).toEqual(expected);
  });

  it('throws an error when the classification object is missing required fields', () => {
    expect(() => parseClassification(invalidJson)).toThrow('Invalid classification');
  });

  it('throws an error when input is null', () => {
    expect(() => parseClassification(null)).toThrow('Object is null');
  });
});

describe('strip classification name', () => {
  it('throws an error when the classification object is missing required fields', () => {});
});
