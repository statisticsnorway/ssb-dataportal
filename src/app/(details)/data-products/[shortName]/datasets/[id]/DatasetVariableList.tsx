import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import DatasetVariableCard from './DatasetVariableCard';
import styles from './dataset-page.module.css';
import { EmptyState, type EmptyStateProps } from './EmptyState';

export default function DatasetVariableList({
  variables,
  isLoading = false,
  emptyState,
}: Readonly<{ variables: DatasetVariableDTO[]; isLoading?: boolean; emptyState: EmptyStateProps }>) {
  const language = localization.getLanguage();
  return (
    <section className={styles.variablesSection}>
      <output aria-atomic='true' className='ds-sr-only'>
        {!isLoading ? localization.datasetDetail.variablesFound.replace('{count}', String(variables.length)) : ''}
      </output>
      {variables.length === 0 ? (
        !isLoading && <EmptyState {...emptyState} />
      ) : (
        <ul className={styles.variablesList}>
          {variables.map((variable) => (
            <DatasetVariableCard key={variable.id} variable={variable} language={language} />
          ))}
        </ul>
      )}
    </section>
  );
}
