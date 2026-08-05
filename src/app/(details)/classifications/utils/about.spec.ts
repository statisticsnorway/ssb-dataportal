import { describe, expect, it } from 'vitest';
import {
  ChangelogResource,
  ClassificationResource,
  ClassificationVersionResource,
  LevelResource,
} from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import classificationMock from '@/static-data/classifications.json';
import versionMock from '@/static-data/versions.json';
import { mapAboutItems, mapChanges, mapLevels } from './about';

const versions = versionMock.versions as unknown as ClassificationVersionResource[];
const classification = classificationMock.classifications[0] as unknown as ClassificationResource;

const byLabel = <T extends { label: string; value?: unknown }>(rows: T[], label: string) =>
  rows.find((r) => r.label === label)?.value;

describe('About details', () => {
  it('returns expected rows for complete data', () => {
    const result = mapAboutItems(versions[0]!, classification);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(8);

    expect(result.map((r) => r.label)).toEqual([
      localization.classification.about.custodian,
      localization.classification.about.mail,
      localization.classification.about.validity,
      localization.classification.about.publishedLanguages,
      localization.classification.about.basedOn,
      localization.classification.about.legalBasis,
      localization.classification.about.publications,
      localization.classification.about.unitTypes,
    ]);
  });

  it('uses notRelevant fallback for missing plain-text fields', () => {
    const version = {
      ...versions[0],
      derivedFrom: '',
      legalBase: '',
      publications: '',
      published: [],
    } as ClassificationVersionResource;

    const result = mapAboutItems(version, classification);

    expect(byLabel(result, localization.classification.about.basedOn)).toBe(
      localization.classification.about.notRelevant,
    );
    expect(byLabel(result, localization.classification.about.legalBasis)).toBe(
      localization.classification.about.notRelevant,
    );
    expect(byLabel(result, localization.classification.about.publications)).toBe(
      localization.classification.about.notRelevant,
    );
    expect(byLabel(result, localization.classification.about.publishedLanguages)).toBe(
      localization.classification.about.notRelevant,
    );
  });
});

describe('Level details', () => {
  it('maps level number and name', () => {
    const level = { levelNumber: 2, levelName: 'Region' } as LevelResource;
    const result = mapLevels(level);

    expect(result).toEqual([
      { label: localization.classification.about.number, value: '2' },
      { label: localization.classification.about.name, value: 'Region' },
    ]);
  });

  it('returns empty values when level is undefined', () => {
    const result = mapLevels(undefined);

    expect(result).toEqual([
      { label: localization.classification.about.number, value: '' },
      { label: localization.classification.about.name, value: '' },
    ]);
  });
});

describe('Changelog details', () => {
  it('maps date/time/comment when changelog is valid', () => {
    const changelog = {
      changeOccured: new Date('2024-01-10T12:34:56Z'),
      description: 'Updated description',
    } as ChangelogResource;

    const result = mapChanges(changelog);

    expect(byLabel(result, localization.classification.about.date)).not.toBe('');
    expect(byLabel(result, localization.classification.about.time)).not.toBe('');
    expect(byLabel(result, localization.classification.about.comment)).toBe('Updated description');
  });

  it('returns empty date/time when changelog date is invalid', () => {
    const changelog = {
      changeOccured: new Date('invalid-date'),
      description: 'Invalid date test',
    } as ChangelogResource;

    const result = mapChanges(changelog);

    expect(byLabel(result, localization.classification.about.date)).toBe('');
    expect(byLabel(result, localization.classification.about.time)).toBe('');
    expect(byLabel(result, localization.classification.about.comment)).toBe('Invalid date test');
  });
});
