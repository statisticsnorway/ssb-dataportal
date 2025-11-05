import { hashCode } from '@/utils/functions';
import styles from './breadcrumbs.module.css';
import Link from 'next/link';

export type BreadcrumbType = {
  href: string;
  text: string;
};

export interface BreadcrumbsProps {
  breadcrumbList?: BreadcrumbType[];
  homeUrl: BreadcrumbType;
}

export const Breadcrumbs = ({ breadcrumbList, homeUrl }: BreadcrumbsProps) => {
  return (
    <div className='container'>
      <nav className={styles.breadcrumbs}>
        <span>
          <Link
            className={styles.link}
            aria-label={"aria"} href={homeUrl.href}>
            {homeUrl.text}
          </Link>
          {breadcrumbList?.map((breadcrumb, i) => {
            return (
              <span key={hashCode(breadcrumb.href)}>
                <span className={styles.separator}>{'>'}</span>
                {i === breadcrumbList.length - 1 ? (
                  <span className={styles.deactiveLink}>{breadcrumb.text}</span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className={styles.link}
                  >
                    {breadcrumb.text}
                  </Link>
                )}
              </span>
            );
          })}
        </span>
      </nav>
    </div>
  );
};

