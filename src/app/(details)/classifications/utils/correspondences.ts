import { addRow } from '@/app/(details)/classifications/utils/commonUtils';
import { CorrespondenceTableSummaryResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { Item } from '@/types/item';

export const mapCorrespondenceItems = (table: CorrespondenceTableSummaryResource): Item[] => {
  const rows: Item[] = [];
  addRow(rows, localization.classification.correspondence.from, table.source);
  addRow(rows, localization.classification.correspondence.fromLevel, table.sourceLevel?.levelName);
  addRow(rows, localization.classification.correspondence.to, table.target);
  addRow(rows, localization.classification.correspondence.toLevel, table.targetLevel?.levelName);
  addRow(rows, localization.classification.correspondence.owner, table.owningSection);
  return rows;
};
