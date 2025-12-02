import { Heading, Tag } from '@digdir/designsystemet-react';
import { HTMLAttributes, ReactNode } from 'react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Breadcrumbs, BreadcrumbType } from '../breadcrumbs';
import { DetailsPageHeader } from './variable-details-page-header';
import styles from './variable-details-page-layout.module.css';

interface DetailsPageProps extends HTMLAttributes<HTMLDivElement> {
  mainContent?: ReactNode;
  asideContent?: ReactNode;
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
  className,
  ...rest
}: DetailsPageProps) => {
  return (
    <section className={`${styles.detailsPage} container ${className ?? ''}`} {...rest}>
      <Breadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />
      <DetailsPageHeader variableDefinition={variableDefinition} />
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
