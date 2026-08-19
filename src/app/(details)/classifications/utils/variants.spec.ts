import { describe, expect, it } from 'vitest';
import { localization } from '@/libs/language';
import { formatVariantName, mapVariantDetails, mapVariantItems } from './variants';

describe('format variant name', () => {
  it('Removes generic variant suffix', () => {
    const variantName = 'Næringsgruppering 2002 - variant av Næringsgruppering (SN) 2002';
    const formattedName = formatVariantName(variantName);
    expect(formattedName).toBe('Næringsgruppering 2002');
  });

  it('returns an empty string when the name is missing', () => {
    expect(formatVariantName(undefined)).toBe('');
  });
});

describe('variant details', () => {
  const variant = {
    id: 42,
    owningSection: '320',
    contactPerson: { name: 'Ada Lovelace' },
    validFrom: new Date('2024-01-02'),
    introduction: 'Alternative grouping',
  };

  it('maps summary fields', () => {
    expect(mapVariantItems(variant)).toEqual([
      { isLocalized: false, label: localization.classification.variant.id, value: 42 },
      { isLocalized: false, label: localization.classification.variant.ownerSection, value: '320' },
    ]);
  });

  it('maps all detail fields', () => {
    const details = mapVariantDetails(variant);

    expect(details).toEqual([
      { isLocalized: false, label: localization.classification.variant.id, value: 42 },
      { isLocalized: false, label: localization.classification.variant.ownerSection, value: '320' },
      { isLocalized: false, label: localization.classification.variant.responsible, value: 'Ada Lovelace' },
      { isLocalized: false, label: localization.classification.variant.validFrom, value: '2.1.2024' },
      { isLocalized: false, label: localization.classification.variant.description, value: 'Alternative grouping' },
    ]);
  });
});
