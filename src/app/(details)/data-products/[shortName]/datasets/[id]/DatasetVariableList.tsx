import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import DatasetVariableCard from './DatasetVariableCard';
import styles from './dataset-page.module.css';

export default function DatasetVariableList({
  variables,
  isLoading = false,
}: Readonly<{ variables: DatasetVariableDTO[]; isLoading?: boolean }>) {
  return (
    <section className={styles.variablesSection}>
      <p role='status' aria-atomic='true' className='ds-sr-only'>
        {!isLoading ? localization.datasetDetail.variablesFound.replace('{count}', String(variables.length)) : ''}
      </p>
      <ul className={styles.variablesList}>
        {variables.length === 0 ? (
          <li className={styles.variableNoHits}>{localization.search.noHits}</li>
        ) : (
          variables.map((variable) => <DatasetVariableCard key={variable.id} variable={variable} />)
        )}
      </ul>
    </section>
  );
}
