import { describe, expect, it } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import classificationMock from '@/static-data/classifications.json';
import { buildUrl } from './urls';
import { mapVersions } from './versions';

const classification = classificationMock.classifications[0] as unknown as ClassificationResource;

describe('Map versions', () => {
  const currentVersion = classification.versions![1];
  const version = classification.versions![2];
  const futureVersion = classification.versions![0];

  it('Version and id are defined', () => {
    const result = mapVersions(version, classification.id);
    expect(result).toBeDefined();
    const element = result[0]?.value as React.ReactElement<{ href: string; children: React.ReactNode }>;
    const validFrom = result[1]?.value;
    const validTo = result[2]?.value;
    expect(element?.props?.href).toBe(buildUrl({ classificationId: 2003, versionId: 2, tab: 'codes' }));
    expect(element?.props?.children).toBe('Oppvarmingskilde 1983');
    expect(validFrom).toBe('1983-01-01');
    expect(validTo).toBe('2001-01-01');
  });

  it('Current version and id are defined', () => {
    const result = mapVersions(currentVersion, classification.id);
    expect(result).toBeDefined();
    const element = result[0]?.value as React.ReactElement<{ href: string; children: React.ReactNode }>;
    const validFrom = result[1]?.value;
    const validTo = result[2]?.value;
    expect(element?.props?.href).toBe(buildUrl({ classificationId: 2003, versionId: 1, tab: 'codes' }));
    expect(element?.props?.children).toBe('Oppvarmingskilde 2001');
    expect(validFrom).toBe('2001-01-01');
    expect(validTo).toBe('2030-01-01');
  });

  it('links versions to the active tab', () => {
    const result = mapVersions(version, classification.id, 'details');
    const element = result[0]?.value as React.ReactElement<{ href: string }>;

    expect(element?.props?.href).toBe(buildUrl({ classificationId: 2003, versionId: 2, tab: 'details' }));
  });

  it('Classification id is not defined version', () => {
    const result = mapVersions(version, undefined);
    expect(result[0]?.value).toBe(version?.name);
    expect(result[1]?.value).toBe('1983-01-01');
    expect(result[2]?.value).toBe('2001-01-01');
  });

  it('Classification id is not defined current version', () => {
    const result = mapVersions(currentVersion, undefined);
    expect(result[0]?.value).toBe(currentVersion?.name);
    expect(result[1]?.value).toBe('2001-01-01');
    expect(result[2]?.value).toBe('2030-01-01');
  });

  it('Version is not defined', () => {
    const result = mapVersions(undefined, classification.id);
    expect(result[0]?.value).toBe('');
    expect(result[1]?.value).toBe('');
    expect(result[2]?.value).toBe('');
  });

  it('Future version is mapped correctly', () => {
    const result = mapVersions(futureVersion, classification.id);
    const element = result[0]?.value as React.ReactElement<{
      href: string;
      children: React.ReactNode;
    }>;

    expect(element?.props?.href).toBe(
      buildUrl({
        classificationId: classification.id,
        versionId: futureVersion?.id,
        tab: 'codes',
      }),
    );
    expect(element?.props?.children).toBe(futureVersion?.name);
    expect(result[1]?.value).toBe(futureVersion?.validFrom);
    expect(result[2]?.value).toBe(localization.noDataPlaceholder);
  });
});
