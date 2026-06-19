import { Card, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './search-hit.module.css';

interface SearchHitProps {
  title?: string;
  href: string;
  description?: string;
  tagsList?: ReactNode;
}

const SearchHit = ({ title, href, description, tagsList }: SearchHitProps) => {
  return (
    <Card aria-label={title} role='article'>
      <Heading data-size='md' className={styles.headingLink} level={2}>
        <Link href={href}>{title && <span className='primaryHeading'>{title}</span>}</Link>
      </Heading>

      {description && <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{description}</Paragraph>}

      {tagsList && <div className={styles.tagsList}>{tagsList}</div>}
    </Card>
  );
};

export { SearchHit };
