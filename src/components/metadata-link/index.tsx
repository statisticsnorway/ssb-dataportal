import { ExternalLinkIcon } from '@navikt/aksel-icons';
import styles from './metadata-link.module.css';

import React, { FC, PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';

export interface MetadataLinkProps {
  /** Internal or external URL */
  to: string;
  /** Indicates external resource */
  external?: boolean;
  /** Icon before link text */
  icon?: ReactNode;
}

export const MetadataLink: FC<PropsWithChildren<MetadataLinkProps>> = ({
  to,
  external,
  icon,
  children,
  ...props
}) => {
  if (external) {
    // External links always use <a>
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        {...props}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
        <ExternalLinkIcon title="ExternalLinkIcon" />
      </a>
    );
  }

  // Internal link uses Next.js Link
  return (
    <Link href={to} className={styles.link} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </Link>
  );
};

export default MetadataLink;