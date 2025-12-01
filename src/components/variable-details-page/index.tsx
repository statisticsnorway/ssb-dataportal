import { Heading, Tag } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Breadcrumbs, BreadcrumbType } from '../breadcrumbs';
import styles from './variable-details-page-layout.module.css';

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
      <header className={styles.detailsPageHeader}>
        <div className={styles.headerInfo}>
          <Heading level={1} data-size="xl">
            {variableDefinition.name.nb}
          </Heading>
          <div className={styles.headerInfoText}>
            <span>{variableDefinition.shortName}</span>
            <div className={styles.separator} />
            <span>ID: {variableDefinition.id}</span>
          </div>
        </div>
        <Tag data-size="md" data-color="info">
          {variableDefinition.variableStatus}
        </Tag>
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
