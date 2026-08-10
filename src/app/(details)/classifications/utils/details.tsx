import { Tag } from '@digdir/designsystemet-react';
import { EmailLink } from '@/components/link-components/emailLink';
import { ChangelogResource, ClassificationVersionResource, LevelResource } from '@/libs/data-access/klass/models';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { isSupportedLanguage } from '@/libs/language';
import { localization } from '@/libs/language/src/localization';
import { Item, VersionItem } from '@/types/item';
import { formatCustodian, formatLanguages, formatLocaleDate } from '@/utils/functions';
import { addRow } from './commonUtils';

/**
 * Formats the changelog timestamp as a Norwegian Bokmål time string (`nb-NO`).
 *
 * Uses 24-hour format with hours, minutes, and seconds (`HH:mm:ss`).
 * Returns an empty string when `changeOccured` is missing or invalid.
 *
 * @param changelog - Changelog entry containing the `changeOccured` timestamp.
 * @returns A localized time string, or an empty string if timestamp is missing/invalid.
 */
const formatChangelogDateTime = (changelog: ChangelogResource | undefined) => {
  if (!changelog?.changeOccured) return '';

  const date = changelog.changeOccured instanceof Date ? changelog.changeOccured : new Date(changelog.changeOccured);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * ------------------------------
 * Version details
 * ------------------------------
 */

/**
 * Builds the list of version details for a classification version.
 *
 * Each row contains a label and a formatted value
 *
 * Missing or non-displayable values are handled by `addRow`, which inserts
 * the localized fallback text for "not relevant".
 *
 * @param version - Classification version source data.
 * @param classification - Classification source data containing statistical units.
 * @returns Ordered rows for rendering in the "details" section.
 */
export const mapDetailsItems = (
  version: ClassificationVersionResource,
  classification: ClassificationResource,
): Item[] => {
  const rows: Item[] = [];
  addRow(rows, localization.classification.about.custodian, formatCustodian(version));
  addRow(rows, localization.classification.about.mail, <EmailLink email={version.contactPerson?.email!} />);
  addRow(rows, localization.classification.about.validity, formatLocaleDate(version.validFrom));
  addRow(
    rows,
    localization.classification.about.publishedLanguages,
    version.published?.filter(isSupportedLanguage).map(formatLanguages).join(', '),
  );
  addRow(rows, localization.classification.about.basedOn, version.derivedFrom);
  addRow(rows, localization.classification.about.legalBasis, version.legalBase);
  addRow(rows, localization.classification.about.publications, version.publications);
  addRow(
    rows,
    localization.classification.about.unitTypes,
    classification.statisticalUnits?.map((unit) => <Tag key={unit}>{unit}</Tag>),
  );

  return rows;
};

/**
 * ------------------------------
 * Level details
 * ------------------------------
 */

/**
 * Maps level data to rows for the level details table.
 *
 * Creates rows for level number and level name. If `level` is missing,
 * row values default to empty strings.
 *
 * @param level - Level source data.
 * @returns Rows for rendering level details.
 */
export const mapLevels = (level: LevelResource | undefined): VersionItem[] => [
  {
    label: localization.classification.about.number,
    value: level?.levelNumber?.toString() ?? '',
  },
  {
    label: localization.classification.about.name,
    value: level?.levelName ?? '',
  },
];

/**
 * ------------------------------
 * Changelog details
 * ------------------------------
 */

/**
 * Maps changelog data to rows for the changelog details table.
 *
 * @param changelog - Changelog entry containing timestamp and description.
 * @returns Rows for rendering changelog details.
 */
export const mapChanges = (changelog: ChangelogResource | undefined): VersionItem[] => [
  {
    label: localization.classification.about.date,
    value: changelog?.changeOccured ? formatLocaleDate(changelog.changeOccured) : '',
  },
  {
    label: localization.classification.about.comment,
    value: changelog?.description ?? '',
  },
];
