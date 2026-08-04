import { describe, expect, it } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { ClassificationType } from '@/types/classification';
import { parseClassification, parseVersion, stripTitlePrefix } from './classificationHelpers';

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
      classificationType: ClassificationType.Classification,
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

describe('parseVersion', () => {
  const validJson = {
    name: 'Oppvarmingskilde 2001',
    id: 1,
    validFrom: '2024-01-01',
    lastModified: '2025-12-03T10:05:55.000+0000',
    _links: {
      self: {
        href: 'https://data.ssb.no/api/klass/v1/versions/1',
      },
    },
  };

  const invalidJson = {
    name: 'Standard for delområde- og grunnkretsinndeling',
    lastModified: '2025-12-03T10:05:55.000+0000',
    _links: {
      self: {
        href: 'https://data.ssb.no/api/klass/v1/versions/1',
      },
    },
  };

  it('returns a parsed version when given valid input', () => {
    const result = parseVersion(validJson);

    const expected: ClassificationVersionResource = {
      name: validJson.name,
      id: validJson.id,
      validFrom: new Date(validJson.validFrom),
      lastModified: new Date(validJson.lastModified),
      links: validJson._links,
    };

    expect(result).toEqual(expected);
  });

  it('throws an error when the version object is missing required fields', () => {
    expect(() => parseVersion(invalidJson)).toThrow('Invalid classification version');
  });

  it('throws an error when input is null', () => {
    expect(() => parseVersion(null)).toThrow('Object is null');
  });
});

describe('Normalize classification name', () => {
  it('strips standard prefix from classification name', () => {
    expect(stripTitlePrefix('Standard for delområde- og grunnkretsinndeling')).toBe(
      'Delområde- og grunnkretsinndeling',
    );
  });

  it('strips code list prefix from classification name', () => {
    expect(stripTitlePrefix('Kodeliste for delområde- og grunnkretsinndeling')).toBe(
      'Delområde- og grunnkretsinndeling',
    );
  });
  it('returns the original classification name when no known prefix is present', () => {
    expect(stripTitlePrefix('Delområde- og grunnkretsinndeling')).toBe('Delområde- og grunnkretsinndeling');
  });
  it('classification name is undefined', () => {
    expect(stripTitlePrefix(undefined)).toBe('');
  });
});
