import { HTMLAttributes, ReactNode } from 'react';
import styles from './details-page-layout.module.css';
import { Breadcrumbs, BreadcrumbType } from '../breadcrumbs';

interface DetailsPageProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    mainContent?: ReactNode;
    children?: ReactNode;
    breadcrumbList?: BreadcrumbType[];
    homeUrl: BreadcrumbType;
}

export const DetailsPageLayout = ({ children, mainContent, title, breadcrumbList, homeUrl }: DetailsPageProps) => {
    return (
        <div className={`${styles.detailPageContainer} container`}>
            <Breadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl}>{}</Breadcrumbs>
            <article className={styles.detailPageContent}>
                <header className={styles.detailPageHeader}>
                    <h2>{title}</h2>
                </header>
                <section className={styles.mainSection}>{mainContent}</section>
                {children}
            </article>
        </div>
    );
};
