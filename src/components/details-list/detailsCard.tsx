import { Card, Divider, Heading } from '@digdir/designsystemet-react';
import type { ReactNode } from 'react';
import styles from './detailsList.module.css';

interface DetailsCardProps {
  title?: string;
  headingId?: string;
  headingLevel?: 2 | 3 | 4;
  lang?: string;
  /** 'padded' for free content, 'list' for rows that handle their own inline padding */
  variant?: 'padded' | 'list';
  className?: string;
  children: ReactNode;
}

const DetailsCard = ({
  title,
  headingId,
  headingLevel = 2,
  lang,
  variant = 'padded',
  className,
  children,
}: Readonly<DetailsCardProps>) => (
  <Card className={`${styles.card} ${className ?? ''}`}>
    {title && (
      <>
        <Heading
          level={headingLevel}
          data-size='md'
          className={`${styles.heading} infoHeadingPrimary`}
          id={headingId ?? `tableHeading-${title}`}
          {...(lang ? { lang } : {})}
        >
          {title}
        </Heading>
        <Divider className={styles.divider} />
      </>
    )}
    <div className={variant === 'list' ? styles.listContent : styles.paddedContent}>{children}</div>
  </Card>
);

export { DetailsCard };
