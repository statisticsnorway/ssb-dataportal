import { Button, Heading } from '@digdir/designsystemet-react';
import { SidebarRightIcon } from '@navikt/aksel-icons';
import { type ReactNode, useId, useState } from 'react';
import { localization } from '@/libs/language';
import styles from './dataset-workspace.module.css';

export type DatasetWorkspaceContent = Readonly<{
  timeline: ReactNode;
  variables: ReactNode;
  showFilters: boolean;
}>;

type Props = DatasetWorkspaceContent &
  Readonly<{
    search: ReactNode;
    period: ReactNode;
    activeFilters: ReactNode;
  }>;

export function DatasetWorkspace({ search, period, activeFilters, timeline, variables, showFilters }: Props) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const filterPanelId = useId();
  const english = localization.getLanguage() === 'en';
  const variablesTitle = english ? 'Variables' : 'Variabler';
  const toggleLabel = english
    ? filtersCollapsed
      ? 'Expand filters'
      : 'Collapse filters'
    : filtersCollapsed
      ? 'Vis filtre'
      : 'Skjul filtre';

  if (!showFilters) return timeline;

  return (
    <div className={styles.workspace}>
      <header className={styles.workspaceToolbar}>
        <Heading level={2} data-size='md' className='secondaryHeading'>
          {variablesTitle}
        </Heading>
      </header>
      <div className={styles.workspaceBody}>
        <aside
          className={`${styles.workspaceRail}${filtersCollapsed ? ` ${styles.workspaceRailCollapsed}` : ''}`}
          aria-label={localization.datasetDetail.filter}
        >
          <div className={styles.workspaceRailToolbar}>
            {!filtersCollapsed ? (
              <Heading level={3} data-size='sm' className={styles.workspaceRailTitle}>
                {localization.datasetDetail.filter}
              </Heading>
            ) : null}
            <Button
              variant='tertiary'
              data-size='sm'
              icon
              aria-label={toggleLabel}
              title={toggleLabel}
              aria-expanded={!filtersCollapsed}
              aria-controls={filterPanelId}
              onClick={() => setFiltersCollapsed((collapsed) => !collapsed)}
            >
              <SidebarRightIcon aria-hidden fontSize='1.5rem' />
            </Button>
          </div>
          <div id={filterPanelId} className={styles.workspaceFilterControls} hidden={filtersCollapsed}>
            {activeFilters}
            <div className={styles.filterGroups}>
              {search}
              {period}
            </div>
          </div>
        </aside>
        <div className={styles.workspaceResults}>
          {timeline}
          <section>
            <Heading level={2} data-size='md' className={`${styles.variablesTitle} secondaryHeading`}>
              {variablesTitle}
            </Heading>
            <div className={styles.variableCollection}>{variables}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
