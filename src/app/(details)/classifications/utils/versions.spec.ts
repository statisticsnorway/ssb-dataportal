import { describe, expect, it } from 'vitest';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language';
import classificationMock from '@/static-data/classifications.json';
import { mapVersions } from './versions';

const classification = classificationMock.classifications[0] as unknown as ClassificationResource;

describe('Map versions', () => {
  const currentVersion = classification.versions![0];
  const version = classification.versions![1];

  it('Version and id are defined', () => {
    const result = mapVersions(version, classification.id);
    expect(result).toBeDefined();
    const element = result[0]?.value as React.ReactElement<{ href: string; children: React.ReactNode }>;
    const validFrom = result[1]?.value;
    const validTo = result[2]?.value;
    expect(element?.props?.href).toBe('/classifications/2003/version/2/codes');
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
    expect(element?.props?.href).toBe('/classifications/2003/version/1/codes');
    expect(element?.props?.children).toBe('Oppvarmingskilde 2001');
    expect(validFrom).toBe('2001-01-01');
    expect(validTo).toBe(localization.versions.now);
  });

  it('keeps the active tab when linking to another version', () => {
    const result = mapVersions(version, classification.id, 'changes');
    const element = result[0]?.value as React.ReactElement<{ href: string }>;

    expect(element?.props?.href).toBe('/classifications/2003/version/2/changes');
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
    expect(result[2]?.value).toBe(localization.versions.now);
  });

  it('Version is not defined', () => {
    const result = mapVersions(undefined, classification.id);
    expect(result[0]?.value).toBe('');
    expect(result[1]?.value).toBe('');
    expect(result[2]?.value).toBe('');
  });
});
