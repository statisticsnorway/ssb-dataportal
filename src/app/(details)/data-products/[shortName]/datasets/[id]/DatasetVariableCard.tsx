import { Card, Heading } from '@digdir/designsystemet-react';
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
    <Card className={styles.variableCard} data-testid={`dataset-variable-card-${variable.id}`}>
      <Heading level={3} className={styles.variableHeading} data-size='sm'>
        {variable.short_name}
      </Heading>
      <dl className={styles.variableTypes}>
        {types.map(([label, typeName]) => (
          <div key={label} className={styles.variableType}>
            <dt>{label}</dt>
            <dd>{typeName ? formatParquetType(typeName) : localization.datasetDetail.notSpecified}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
