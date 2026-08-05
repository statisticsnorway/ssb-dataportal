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

const addRow = (rows: Item[], label: string, value: string | undefined | null) => {
  const v = value?.trim();
  if (v) rows.push({ label, value: v });
};

export const mapAboutItems = (c: ClassificationVersionResource, classification: ClassificationResource): Item[] => {
  const rows: Item[] = [];
  addRow(rows, localization.classification.about.custodian, c.contactPerson?.name);
  addRow(rows, localization.classification.about.mail, c.contactPerson?.email);
  addRow(
    rows,
    localization.classification.about.validity,
    c.validFrom && c.validTo ? `${formatDate(c.validFrom)} - ${formatDate(c.validTo)}` : '',
  );
  addRow(rows, localization.classification.about.publishedLanguages, c.published?.map(formatLanguages).join(', '));
  addRow(rows, localization.classification.about.basedOn, c.derivedFrom);
  addRow(rows, localization.classification.about.legalBasis, c.legalBase);
  addRow(rows, localization.classification.about.publications, c.publications);
  addRow(rows, localization.classification.about.unitTypes, classification.statisticalUnits?.join(', '));

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
    label: localization.classification.about.comment,
    value: c?.description ?? '',
  },
];
