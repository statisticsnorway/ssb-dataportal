import { Card, Heading, Link, Paragraph, Tag } from '@digdir/designsystemet-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { ReactNode } from 'react';
import styles from './search-hit.module.css';

interface SearchHitProps {
  title?: string;
  href?: string;
  description?: string;
  tagsList?: ReactNode;
}
// const resolveLanguage prop
// has not value in selected language
const hasNotValueInSelectedLanguage = true;
const SearchHit = ({ title, href, description, tagsList }: SearchHitProps) => {
  return (
    <Card aria-label={title} role='article'>
      {hasNotValueInSelectedLanguage && (
        <div className={styles.hasNotValueInSelectedLanguage}>
          <Tag data-size='lg' className={styles.languageTag}>
            <InformationSquareIcon />
            Engelsk
          </Tag>
        </div>
      )}
      {href && title ? (
        <Heading data-size='md' className={styles.headingLink} level={2}>
          <Link href={href}>{title && <span className='primaryHeading'>{title}</span>}</Link>
        </Heading>
      ) : undefined}

      {description && <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{description}</Paragraph>}

      {tagsList && <div className={styles.tagsList}>{tagsList}</div>}
    </Card>
  );
};

export { SearchHit };
