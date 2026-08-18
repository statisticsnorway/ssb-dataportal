import Link from 'next/link';
import { ClassificationVersionSummaryResource } from '@/libs/data-access/klass/models/ClassificationVersionSummaryResource';
import { localization } from '@/libs/language/src/localization';
import { VersionItem } from '@/types/item';
import { buildUrl } from './urls';

const mapVersionName = (v: ClassificationVersionSummaryResource, classificationId: number | undefined) => {
  if (!classificationId) return v.name;
  return <Link href={buildUrl({ classificationId, versionId: v.id, tab: 'codes' })}>{v.name}</Link>;
};

/**
 * Maps a classification version to a list of display items for the versions table.
 *
 * @param v - The version to map. If undefined, all values will be empty strings.
 * @param classificationId - The classification id. If defined, the version name will be rendered as a link.
 * If undefined, the version name will be rendered as plain text.
 * @returns An array of `VersionItem` with label/value pairs for name, validFrom and validTo.
 * - `name`: Link to version codes if `classificationId` is defined, otherwise plain text. Empty string if `v` is undefined.
 * - `validFrom`: The version's start date, or empty string if `v` is undefined.
 * - `validTo`: The version's end date, `localization.versions.now` if no end date (current version), or empty string if `v` is undefined.
 */
export const mapVersions = (
  v: ClassificationVersionSummaryResource | undefined,
  classificationId: number | undefined,
): VersionItem[] => [
  {
    label: localization.versions.name,
    value: v ? mapVersionName(v, classificationId) : '',
  },
  {
    label: localization.versions.validFrom,
    value: v?.validFrom ?? '',
  },
  {
    label: localization.versions.validTo,
    value: v ? (v.validTo ?? localization.versions.now) : '',
  },
];
