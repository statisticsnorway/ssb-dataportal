import { Link } from '@digdir/designsystemet-react';
import { hashCode } from '@/utils/functions';
import styles from './breadcrumbs.module.css';

export type BreadcrumbType = {
  href: string;
  text: string;
};

export interface BreadcrumbsProps {
  breadcrumbList?: BreadcrumbType[];
  homeUrl: BreadcrumbType;
  breadcrumbHomeAriaLabel: string;
}

export const Breadcrumbs = ({ breadcrumbList, homeUrl, breadcrumbHomeAriaLabel }: BreadcrumbsProps) => {
  return (
    <>
      <nav className={styles.breadcrumbs}>
        <span>
          <Link className={styles.link} aria-label={breadcrumbHomeAriaLabel} href={homeUrl.href}>
            {homeUrl.text}
          </Link>
          {breadcrumbList?.map((breadcrumb, i) => {
            return (
              <span key={hashCode(breadcrumb.href)}>
                <span className={styles.separator}>{'>'}</span>
                {i === breadcrumbList.length - 1 ? (
                  <span className={styles.deactiveLink}>{breadcrumb.text}</span>
                ) : (
                  <Link href={breadcrumb.href} className={styles.link}>
                    {breadcrumb.text}
                  </Link>
                )}
              </span>
            );
          })}
        </span>
      </nav>
    </>
  );
};
