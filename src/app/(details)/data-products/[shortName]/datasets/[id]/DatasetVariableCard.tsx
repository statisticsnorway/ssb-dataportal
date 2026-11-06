import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './dataset-page.module.css';

type TypeDetail = Readonly<{
  label: string;
  value: string;
  variant: 'default' | 'notSpecified';
}>;

export default function DatasetVariableCard({ variable }: Readonly<{ variable: DatasetVariableDTO }>) {
  const types: TypeDetail[] = [
    {
      label: localization.datasetDetail.physicalType,
      value: variable.physical_type ? formatParquetType(variable.physical_type) : '–',
      variant: 'default',
    },
    {
      label: localization.datasetDetail.logicalType,
      value: variable.logical_type ? formatParquetType(variable.logical_type) : '–',
      variant: variable.logical_type ? 'default' : 'notSpecified',
    },
  ];

  return (
    <li className={styles.variableItem} data-testid={`dataset-variable-card-${variable.id}`}>
      <code className={styles.variableName} title={variable.short_name}>
        {variable.short_name}
      </code>
      <dl className={styles.variableTypes}>
        {types.map(({ label, value, variant }) => (
          <div key={label} className={styles.variableType}>
            <dt>{label}</dt>
            <dd className={variant === 'notSpecified' ? styles.variableTypeMissing : undefined}>{value}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
