import { HTMLAttributes, ReactNode } from 'react';
import styles from './details-page-layout.module.css';

interface DetailsPageProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    mainContent?: ReactNode;
    children?: ReactNode;
}

export const DetailsPageLayout = ({ children, mainContent, title }: DetailsPageProps) => {

    return (
        <div className={`${styles.detailPageContainer} container`}>
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
