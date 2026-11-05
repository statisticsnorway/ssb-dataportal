import { Card, Heading } from '@digdir/designsystemet-react';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './dataset-page.module.css';

export default function DatasetVariableCard({ variable }: Readonly<{ variable: DatasetVariableDTO }>) {
  return (
    <Card className={styles.variableCard} data-testid={`dataset-variable-card-${variable.id}`}>
      <Heading level={3} className={styles.variableHeading} data-size='sm'>
        {variable.short_name}
      </Heading>
      <dl className={styles.variableTypes}>
        <div className={styles.variableType}>
          <dt>{localization.datasetDetail.physicalType}</dt>
          <dd>
            {variable.physical_type_name
              ? formatParquetType(variable.physical_type_name)
              : localization.datasetDetail.notSpecified}
          </dd>
        </div>
        <div className={styles.variableType}>
          <dt>{localization.datasetDetail.logicalType}</dt>
          <dd>
            {variable.logical_type_name
              ? formatParquetType(variable.logical_type_name)
              : localization.datasetDetail.notSpecified}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
