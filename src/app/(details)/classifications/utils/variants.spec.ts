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
    validTo: new Date('2025-01-02'),
    introduction: 'Alternative grouping',
  };

  it('maps summary fields', () => {
    expect(mapVariantItems(variant)).toEqual([
      { label: localization.classification.variant.id, value: 42 },
      { label: localization.classification.variant.ownerSection, value: '320' },
    ]);
  });

  it('maps all detail fields', () => {
    const details = mapVariantDetails(variant);

    expect(details).toEqual([
      { label: localization.classification.variant.id, value: 42 },
      { label: localization.classification.variant.ownerSection, value: '320' },
      { label: localization.classification.variant.responsible, value: 'Ada Lovelace' },
      { label: localization.validity.validFrom, value: '2.1.2024' },
      { label: localization.validity.validTo, value: '2.1.2025' },
      { label: localization.classification.variant.description, value: 'Alternative grouping' },
    ]);
  });
});
