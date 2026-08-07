import { Tag } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { EmailLink } from '@/components/link-components/emailLink';
import { ChangelogResource, ClassificationVersionResource, LevelResource } from '@/libs/data-access/klass/models';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { isSupportedLanguage } from '@/libs/language';
import { localization } from '@/libs/language/src/localization';
import { Item, VersionItem } from '@/types/item';
import { formatCustodian, formatLanguages, formatLocaleDate } from '@/utils/functions';

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
 * Adds a labeled row to the output list for the "details" section.
 *
 * If `value` is not displayable (for example `null`, `undefined`, `false`, or an empty string),
 * the localized fallback text for "not relevant" is used instead in the "details" section.
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
