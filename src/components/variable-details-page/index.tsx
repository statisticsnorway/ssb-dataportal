import { Heading } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Breadcrumbs, BreadcrumbType } from '../breadcrumbs';
import styles from './variable-details-page-layout.module.css';
import { VariableStatusField } from '../variable-details/variable-status';

interface DetailsPageProps extends HTMLAttributes<HTMLDivElement> {
  mainContent?: ReactNode;
  asideContent?: ReactNode;
  children?: ReactNode;
  breadcrumbList?: BreadcrumbType[];
  homeUrl: BreadcrumbType;
  variableDefinition: CompleteResponse;
}

export const VariableDetailsPageLayout = ({
  children,
  mainContent,
  asideContent,
  breadcrumbList,
  homeUrl,
  variableDefinition,
}: DetailsPageProps) => {
  return (
    <section className={`${styles.detailsPage} container`}>
      <Breadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />

      {/* <div className={styles.hero}>
        <div className={styles.heroRow}>
          <div className={styles.heroInfo}>
            <div className={styles.heroTitle}>
              <h1>{variableDefinition.name.nb}</h1>
              <div className={styles.idBadge}>{variableDefinition.id}</div>
            </div>
            <p>{variableDefinition.shortName}</p>
          </div>
          <div className={styles.statusBox}>
            {variableDefinition.variableStatus}
          </div>
        </div>
      </div> */}

    <header className={styles.detailsPageHeader}>
      <div className={styles.headerInfo}>
        <Heading level={1} data-size="xl">
          {variableDefinition.name.nb}
        </Heading>
        <p>{variableDefinition.shortName}</p>
      </div>
      <VariableStatusField status={variableDefinition.variableStatus} />
    </header>


      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {mainContent}
          {children}
        </div>

        <aside className={styles.sidebar}>{asideContent}</aside>
      </div>
    </section>
  );
};
