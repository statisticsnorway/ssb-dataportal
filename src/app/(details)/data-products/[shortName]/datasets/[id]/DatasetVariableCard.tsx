import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './dataset-page.module.css';

export default function DatasetVariableCard({ variable }: Readonly<{ variable: DatasetVariableDTO }>) {
  const types = [
    [localization.datasetDetail.physicalType, variable.physical_type_name],
    [localization.datasetDetail.logicalType, variable.logical_type_name],
  ] as const;

  return (
    <li className={styles.variableItem} data-testid={`dataset-variable-card-${variable.id}`}>
      <code className={styles.variableName}>{variable.short_name}</code>
      <dl className={styles.variableTypes}>
        {types.map(([label, typeName]) => (
          <div key={label} className={styles.variableType}>
            <dt>{label}</dt>
            <dd className={typeName ? undefined : styles.variableTypeMissing}>
              {typeName ? formatParquetType(typeName) : localization.datasetDetail.notSpecified}
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
