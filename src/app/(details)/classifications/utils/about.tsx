import { Tag } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { EmailLink } from '@/components/link-components/emailLink';
import { ChangelogResource, ClassificationVersionResource, LevelResource } from '@/libs/data-access/klass/models';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import { Item } from '@/types/item';
import { VersionItem } from '../components/versions-table';

/**
 * Formats a date value to a Norwegian Bokmål locale date string (`nb-NO`).
 *
 * Returns an empty string when the input is missing or cannot be parsed as a valid date.
 *
 * @param date - A `Date` instance, date string, or `undefined`.
 * @returns The formatted date string, or an empty string if invalid/missing.
 */
const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  const parsedDate = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleDateString('nb-NO');
};

/**
 * Maps a language code to its localized display label used in the classification "about" section.
 *
 * Supports `en`, `nb`, and `nn`. If the code is unknown, the original value is returned.
 *
 * @param language - Language code from classification data (for example: `en`, `nb`, `nn`).
 * @returns A localized language label, or the original language code when no mapping exists.
 */
const formatLanguages = (language: string) => {
  switch (language) {
    case 'en':
      return localization.classification.about.langEN;
    case 'nb':
      return localization.classification.about.langNB;
    case 'nn':
      return localization.classification.about.langNN;
    default:
      return language;
  }
};

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
 * Format the custodian information (contact person and owning section) extracted from classification version
 * @param classificationVersion
 * @returns
 */
const formatCustodian = (classificationVersion: ClassificationVersionResource | undefined) => {
  if (!classificationVersion) return '';

  const name = classificationVersion.contactPerson?.name?.trim();
  const section = classificationVersion.owningSection?.trim();

  return [name, section].filter(Boolean).join(', ');
};

/**
 * Determines whether a React node contains a value that should be rendered.
 *
 * Treats `null`, `undefined`, `false`, empty strings, and arrays containing only non-displayable values as not displayable.
 *
 * @param value - The React node to evaluate.
 * @returns `true` if the value should be displayed; otherwise `false`.
 */
const hasDisplayValue = (value: ReactNode | undefined | null): boolean => {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.some((v) => hasDisplayValue(v));
  return true;
};

/**
 * Adds a labeled row to the output list for the "about" section.
 *
 * If `value` is not displayable (for example `null`, `undefined`, `false`, or an empty string),
 * the localized fallback text for "not relevant" is used instead.
 *
 * @param rows - Mutable list of rows to append to.
 * @param label - Row label shown in the UI.
 * @param value - Row value to render.
 */
const addRow = (rows: Item[], label: string, value: ReactNode | undefined | null) => {
  rows.push({
    label,
    value: hasDisplayValue(value) ? value : localization.classification.about.notRelevant,
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
 * @returns Ordered rows for rendering in the "about" section.
 */
export const mapAboutItems = (
  version: ClassificationVersionResource,
  classification: ClassificationResource,
): Item[] => {
  const rows: Item[] = [];
  addRow(rows, localization.classification.about.custodian, formatCustodian(version));
  addRow(rows, localization.classification.about.mail, <EmailLink email={version.contactPerson?.email!} />);
  addRow(rows, localization.classification.about.validity, formatDate(version.validFrom));
  addRow(
    rows,
    localization.classification.about.publishedLanguages,
    version.published?.map(formatLanguages).join(', '),
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
    value: changelog?.changeOccured ? formatDate(changelog.changeOccured) : '',
  },
  {
    label: localization.classification.about.time,
    value: changelog?.changeOccured ? formatChangelogDateTime(changelog) : '',
  },
  {
    label: localization.classification.about.comment,
    value: changelog?.description ?? '',
  },
];
