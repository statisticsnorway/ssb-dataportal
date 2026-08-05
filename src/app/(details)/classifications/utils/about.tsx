import { Tag } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { EmailLink } from '@/components/link-components/emailLink';
import { ChangelogResource, ClassificationVersionResource, LevelResource } from '@/libs/data-access/klass/models';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import { Item } from '@/types/item';
import { VersionItem } from '../components/versions-table';

const formatDate = (d: Date | string | undefined) => {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('nb-NO');
};

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

const formatChangelogDateTime = (c: ChangelogResource | undefined) => {
  if (!c?.changeOccured) return '';

  const date = c.changeOccured instanceof Date ? c.changeOccured : new Date(c.changeOccured);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Format the custodian information (contact person and owning section)
 * @param classification
 * @returns
 */
const formatCustodian = (classification: ClassificationVersionResource | undefined) => {
  if (!classification) return '';

  const name = classification.contactPerson?.name?.trim();
  const section = classification.owningSection?.trim();

  return [name, section].filter(Boolean).join(', ');
};

const formatValidity = (validFrom: Date | string | undefined) => {
  if (!validFrom) return '';
  return `${formatDate(validFrom)}`;
};

const hasDisplayValue = (value: ReactNode | undefined | null): boolean => {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.some((v) => hasDisplayValue(v));
  return true;
};

const addRow = (rows: Item[], label: string, value: ReactNode | undefined | null) => {
  rows.push({
    label,
    value: hasDisplayValue(value) ? value : localization.classification.about.notRelevant,
  });
};

export const mapAboutItems = (c: ClassificationVersionResource, classification: ClassificationResource): Item[] => {
  const rows: Item[] = [];
  addRow(rows, localization.classification.about.custodian, formatCustodian(c));
  addRow(rows, localization.classification.about.mail, <EmailLink email={c.contactPerson?.email!} />);
  addRow(rows, localization.classification.about.validity, formatValidity(c.validFrom));
  addRow(rows, localization.classification.about.publishedLanguages, c.published?.map(formatLanguages).join(', '));
  addRow(rows, localization.classification.about.basedOn, c.derivedFrom);
  addRow(rows, localization.classification.about.legalBasis, c.legalBase);
  addRow(rows, localization.classification.about.publications, c.publications);
  addRow(
    rows,
    localization.classification.about.unitTypes,
    classification.statisticalUnits?.map((unit) => <Tag key={unit}>{unit}</Tag>),
  );

  return rows;
};

export const mapLevels = (l: LevelResource | undefined): VersionItem[] => [
  {
    label: localization.classification.about.number,
    value: l?.levelNumber?.toString() ?? '',
  },
  {
    label: localization.classification.about.name,
    value: l?.levelName ?? '',
  },
];

export const mapChanges = (c: ChangelogResource | undefined): VersionItem[] => [
  {
    label: localization.classification.about.date,
    value: c?.changeOccured ? formatDate(c.changeOccured) : '',
  },
  {
    label: localization.classification.about.time,
    value: c?.changeOccured ? formatChangelogDateTime(c) : '',
  },
  {
    label: localization.classification.about.comment,
    value: c?.description ?? '',
  },
];
