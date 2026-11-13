import { Fragment } from 'react';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './dataset-page.module.css';

type TypeDisplay =
  | Readonly<{
      variant: 'specified';
      mainType: string;
      storedAs?: string;
    }>
  | Readonly<{ variant: 'notSpecified' }>;

function getTypeDisplay(variable: DatasetVariableDTO, language: string): TypeDisplay {
  if (variable.logical_type) {
    const mainType = formatParquetType(variable.logical_type, language);
    const storedAs = variable.physical_type ? formatParquetType(variable.physical_type, language) : undefined;
    const typeDisplay: TypeDisplay = {
      variant: 'specified',
      mainType,
    };

    if (storedAs) return { ...typeDisplay, storedAs };

    return typeDisplay;
  }

  if (variable.physical_type) {
    const mainType = formatParquetType(variable.physical_type, language);
    return {
      variant: 'specified',
      mainType,
    };
  }

  return { variant: 'notSpecified' };
}

export default function DatasetVariableCard({ variable }: Readonly<{ variable: DatasetVariableDTO }>) {
  const language = localization.getLanguage();
  const typeDisplay = getTypeDisplay(variable, language);
  const variableNameParts = variable.short_name.split('_');

  return (
    <li className={styles.variableItem} data-testid={`dataset-variable-card-${variable.id}`}>
      <code className={styles.variableName} title={variable.short_name}>
        {variableNameParts.map((part, index) => (
          <Fragment key={`${index}-${part}`}>
            {part}
            {index < variableNameParts.length - 1 ? (
              <>
                _<wbr />
              </>
            ) : null}
          </Fragment>
        ))}
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
                  <span className={styles.variableTypeStoredAs}>
                    {localization.datasetDetail.storedAs} {typeDisplay.storedAs}
                  </span>
                ) : null}
              </>
            )}
          </dd>
        </div>
      </dl>
    </li>
  );
}
