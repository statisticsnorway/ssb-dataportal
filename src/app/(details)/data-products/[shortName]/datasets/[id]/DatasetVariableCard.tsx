import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './dataset-page.module.css';

type TypeDisplay =
  | Readonly<{ variant: 'specified'; mainType: string; storedAs?: string }>
  | Readonly<{ variant: 'notSpecified' }>;

function getTypeDisplay(variable: DatasetVariableDTO): TypeDisplay {
  if (variable.logical_type) {
    const typeDisplay: TypeDisplay = {
      variant: 'specified',
      mainType: formatParquetType(variable.logical_type),
    };

    if (variable.physical_type) {
      return { ...typeDisplay, storedAs: formatParquetType(variable.physical_type) };
    }

    return typeDisplay;
  }

  if (variable.physical_type) {
    return { variant: 'specified', mainType: formatParquetType(variable.physical_type) };
  }

  return { variant: 'notSpecified' };
}

export default function DatasetVariableCard({ variable }: Readonly<{ variable: DatasetVariableDTO }>) {
  const typeDisplay = getTypeDisplay(variable);

  return (
    <li className={styles.variableItem} data-testid={`dataset-variable-card-${variable.id}`}>
      <code className={styles.variableName} title={variable.short_name}>
        {variable.short_name}
      </code>
      <dl className={styles.variableTypes}>
        <div className={styles.variableType}>
          <dt>{localization.classification.type}</dt>
          <dd className={typeDisplay.variant === 'notSpecified' ? styles.variableTypeMissing : undefined}>
            {typeDisplay.variant === 'notSpecified' ? (
              <>
                <span aria-hidden='true'>–</span>
                <span className='ds-sr-only'>{localization.datasetDetail.notSpecified}</span>
              </>
            ) : (
              <>
                {typeDisplay.mainType}
                {typeDisplay.storedAs ? (
                  <span className={styles.variableTypeStoredAs}>Lagret som {typeDisplay.storedAs}</span>
                ) : null}
              </>
            )}
          </dd>
        </div>
      </dl>
    </li>
  );
}
