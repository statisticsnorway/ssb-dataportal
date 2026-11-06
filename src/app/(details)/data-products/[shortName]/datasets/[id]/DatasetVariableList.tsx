import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import DatasetVariableCard from './DatasetVariableCard';
import styles from './dataset-page.module.css';

export default function DatasetVariableList({ variables }: Readonly<{ variables: DatasetVariableDTO[] }>) {
  return (
    <section className={styles.variablesSection}>
      <ul className={styles.variablesList}>
        {variables.length === 0 ? (
          <li className={styles.variableNoHits}>
            <output>{localization.search.noHits}</output>
          </li>
        ) : (
          variables.map((variable) => <DatasetVariableCard key={variable.id} variable={variable} />)
        )}
      </ul>
    </section>
  );
}
