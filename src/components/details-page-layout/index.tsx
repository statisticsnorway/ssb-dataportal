import { HTMLAttributes, ReactNode } from 'react';
import { Breadcrumbs, BreadcrumbType } from '../breadcrumbs';
import styles from './details-page-layout.module.css';

interface DetailsPageProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  mainContent?: ReactNode;
  children?: ReactNode;
  breadcrumbList?: BreadcrumbType[];
  homeUrl: BreadcrumbType;
  ariaLabel: string;
}

export const DetailsPageLayout = ({
  children,
  mainContent,
  title,
  breadcrumbList,
  homeUrl,
  ariaLabel,
}: DetailsPageProps) => {
  return (
    <div className={`${styles.detailPageContainer} container`}>
      <Breadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} breadcrumbHomeAriaLabel={ariaLabel}>
        {}
      </Breadcrumbs>
      <article className={styles.detailPageContent}>
        <header className={styles.detailPageHeader}>
          <h2>{title}</h2>
        </header>
        <section className={styles.mainSection}>{mainContent}</section>
        {children}
        <aside></aside>
      </article>
    </div>
  );
};
