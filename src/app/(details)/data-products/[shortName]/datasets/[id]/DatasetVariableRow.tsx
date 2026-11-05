import { Tag } from '@digdir/designsystemet-react';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './dataset-page.module.css';

export default function DatasetVariableRow({ variable }: Readonly<{ variable: DatasetVariableDTO }>) {
  const logicalType = variable.logical_type_name ? formatParquetType(variable.logical_type_name) : undefined;
  const physicalType = variable.physical_type_name ? formatParquetType(variable.physical_type_name) : undefined;

  return (
    <div className={styles.variableRow} data-testid='dataset-variable-row' role='listitem'>
      <code className={styles.variableName}>{variable.short_name}</code>
      <div className={styles.variableTags}>
        {logicalType ? (
          <Tag aria-label={`${localization.datasetDetail.logicalType}: ${logicalType}`}>{logicalType}</Tag>
        ) : null}
        {physicalType ? (
          <Tag variant='outline' aria-label={`${localization.datasetDetail.physicalType}: ${physicalType}`}>
            {physicalType}
          </Tag>
        ) : null}
      </div>
    </div>
  );
}
