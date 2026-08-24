import { describe, expect, it } from 'vitest';
import { ChangelogResource, ClassificationVersionResource, LevelResource } from '@/libs/data-access/klass/models';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import { mapChanges, mapDetailsItems, mapLevels } from './details';

const baseVersion: ClassificationVersionResource = {
  name: 'Version 1',
  contactPerson: { email: 'test@ssb.no', name: 'Test', phone: '' },
  validFrom: '2024-01-01',
  published: ['nb', 'en'],
  derivedFrom: 'Base classification',
  legalBase: 'Some law',
  publications: 'Some publication',
} as unknown as ClassificationVersionResource;

const baseClassification: ClassificationResource = {
  statisticalUnits: ['Person', 'Household'],
} as unknown as ClassificationResource;

describe('mapAboutItems', () => {
  it('maps all populated fields to rows', () => {
    const rows = mapDetailsItems(baseVersion, baseClassification);

    const labels = rows.map((r) => r.label);
    expect(labels).toEqual([
      localization.classification.about.custodian,
      localization.classification.about.mail,
      localization.classification.about.publishedLanguages,
      localization.classification.about.basedOn,
      localization.classification.about.legalBasis,
      localization.classification.about.publications,
      localization.classification.about.unitTypes,
    ]);

    // No row should fall back to "not relevant" when all fields are set
    expect(rows.every((r) => r.value !== '—')).toBe(true);
  });

  it('display for missing/empty fields', () => {
    const emptyVersion = {
      contactPerson: { email: '' },
      published: [],
    } as unknown as ClassificationVersionResource;
    const emptyClassification = { statisticalUnits: [] } as unknown as ClassificationResource;

    const rows = mapDetailsItems(emptyVersion, emptyClassification);
    const fallbackLabels = rows.filter((r) => r.value === '—').map((r) => r.label);

    expect(fallbackLabels).toContain(localization.classification.about.basedOn);
    expect(fallbackLabels).toContain(localization.classification.about.legalBasis);
    expect(fallbackLabels).toContain(localization.classification.about.publications);
    expect(fallbackLabels).toContain(localization.classification.about.unitTypes);
    expect(fallbackLabels).toContain(localization.classification.about.publishedLanguages);
  });

  it('renders statisticalUnits as Tag elements', () => {
    const rows = mapDetailsItems(baseVersion, baseClassification);
    const unitRow = rows.find((r) => r.label === localization.classification.about.unitTypes);
    expect(Array.isArray(unitRow?.value)).toBe(true);
    expect(unitRow?.value as unknown[]).toHaveLength(2);
  });
});

describe('mapLevels', () => {
  it('maps level number and name', () => {
    const level: LevelResource = { levelNumber: 2, levelName: 'Group' } as LevelResource;
    const rows = mapLevels(level);

    expect(rows).toEqual([
      { label: localization.classification.about.number, value: '2' },
      { label: localization.classification.about.name, value: 'Group' },
    ]);
  });

  it('returns empty strings when level is undefined', () => {
    const rows = mapLevels(undefined);
    expect(rows.map((r) => r.value)).toEqual(['', '']);
  });

  it('returns empty strings when level fields are missing', () => {
    const rows = mapLevels({} as LevelResource);
    expect(rows.map((r) => r.value)).toEqual(['', '']);
  });
});

describe('mapChanges', () => {
  it('maps changelog date, time, and description', () => {
    const changelog: ChangelogResource = {
      changeOccured: '2024-05-15T09:30:45',
      description: 'Updated code list',
    } as unknown as ChangelogResource;

    const rows = mapChanges(changelog);

    expect(rows[0]?.label).toBe(localization.classification.about.date);
    expect(rows[0]?.value).toBeTruthy();
    expect(rows[0]?.value).toMatch(/^\d{1,2}.\d{1,2}.\d{4}$/);

    expect(rows[1]).toEqual({
      label: localization.classification.about.comment,
      value: 'Updated code list',
    });
  });

  it('accepts a Date instance for changeOccured', () => {
    const changelog = {
      changeOccured: new Date('2024-05-15T09:30:45'),
      description: 'x',
    } as unknown as ChangelogResource;

    const rows = mapChanges(changelog);
    expect(rows[0]?.value).toMatch(/^\d{1,2}.\d{1,2}.\d{4}$/);
  });

  it('returns empty date/time when changeOccured is missing', () => {
    const rows = mapChanges({ description: 'only text' } as ChangelogResource);
    expect(rows[0]?.value).toBe('');
    expect(rows[1]?.value).toBe('only text');
  });

  it('returns empty date/time when changeOccured is invalid', () => {
    const rows = mapChanges({ changeOccured: 'not-a-date' } as unknown as ChangelogResource);
    expect(rows[1]?.value).toBe('');
  });

  it('handles undefined changelog', () => {
    const rows = mapChanges(undefined);
    expect(rows.map((r) => r.value)).toEqual(['', '']);
  });
});

describe('mapAboutItems edge cases', () => {
  it('treats explicit false and whitespace-only strings as not relevant', () => {
    const version = {
      contactPerson: { email: 'x@y.no' },
      validFrom: '   ',
      published: ['nb'],
      derivedFrom: false as unknown as string,
      legalBase: '',
      publications: '   ',
    } as unknown as ClassificationVersionResource;

    const rows = mapDetailsItems(version, { statisticalUnits: [] } as unknown as ClassificationResource);

    expect(rows.find((r) => r.label === localization.classification.about.basedOn)?.value).toBe('—');
    expect(rows.find((r) => r.label === localization.classification.about.legalBasis)?.value).toBe('—');
    expect(rows.find((r) => r.label === localization.classification.about.publications)?.value).toBe('—');
  });
});
