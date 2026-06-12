import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/dist/client/link';
import { ReactNode } from 'react';
import { ClassificationResource } from '@/libs/data-access/klass';
import styles from '../../variable-definitions/components/vardef.module.css';

interface SearchHitProps {
  classification?: ClassificationResource;
}

interface HeadingLinkProps {
  href: string;
  children: ReactNode;
}

const HeadingLink = ({ href, children }: HeadingLinkProps) => (
  <Link href={href} className={styles.vardefHeadingLink}>
    {children}
  </Link>
);

const ClassificationSearchHit = ({ classification }: SearchHitProps) => {
  return (
    <Card data-testid='klass-search-card'>
      <Heading data-size='md' className={styles.vardefHeadingLink} level={2}>
        <HeadingLink href={''}>
          <span className='secondaryHeading'>{classification?.name}</span>
        </HeadingLink>
      </Heading>

      <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{String(classification?.description)}</Paragraph>

      <div className={styles.tagsList}>Tags</div>
    </Card>
  );
};

export { ClassificationSearchHit };
