/** biome-ignore-all lint/suspicious/noExplicitAny: <Type any is necessary for test> */
import { describe, expect, it } from 'vitest';
import { localization } from '@/libs/language';
import { mapAboutVariableItems } from './groups';

describe('mapAboutVariableItems - classification_uri', () => {
  const base = {
    unit_types: [],
    subject_fields: [],
    valid_from: new Date('2024-01-01'),
    contains_special_categories_of_personal_data: false,
  } as any;

  it('includes classification item when classification_uri exists', () => {
    const v = {
      ...base,
      classification_uri: 'https://example.com/classification/91',
    };

    const result = mapAboutVariableItems(v, false, 'api-url');

    const classification = result.find((item) => item.label === localization.classification.label);

    expect(classification).toBeDefined();

    const link = classification?.value as any;

    expect(link.props.href).toBe('https://example.com/classification/91');
  });

  it('does not include classification item when missing', () => {
    const v = {
      ...base,
      classification_uri: undefined,
    };

    const result = mapAboutVariableItems(v, false, 'api-url');

    expect(result.find((item) => item.label === localization.classification.label)).toBeUndefined();
  });
});
