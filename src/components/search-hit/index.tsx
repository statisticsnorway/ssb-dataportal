import { Card, Heading, Link, Paragraph, Tag, Tooltip } from '@digdir/designsystemet-react';
import { GlobeIcon } from '@navikt/aksel-icons';
import { ReactNode } from 'react';
import { localization, SupportedLanguage } from '@/libs/language';
import { formatLanguages } from '@/utils/functions';
import styles from './search-hit.module.css';

interface SearchHitProps {
  title?: string;
  href?: string;
  description?: string;
  tagsList?: ReactNode;
  fallbackLanguage?: SupportedLanguage;
}

const SearchHit = ({ title, href, description, tagsList, fallbackLanguage }: SearchHitProps) => {
  return (
    <Card aria-label={title} role='article'>
      {fallbackLanguage && (
        <div className={styles.hasNotValueInSelectedLanguage}>
          <Tooltip content={localization.classification.language.notSelectedLanguage}>
            <Tag data-size='lg' className={styles.languageTag} tabIndex={0}>
              <GlobeIcon />
              {formatLanguages(fallbackLanguage)}
            </Tag>
          </Tooltip>
        </div>
      )}
      {href && title ? (
        fallbackLanguage ? (
          <Heading data-size='md' className={styles.headingLink} level={2}>
            <Link href={href}>
              {title && (
                <span className='primaryHeading' lang={fallbackLanguage}>
                  {title}
                </span>
              )}
            </Link>
          </Heading>
        ) : (
          <Heading data-size='md' className={styles.headingLink} level={2}>
            <Link href={href}>{title && <span className='primaryHeading'>{title}</span>}</Link>
          </Heading>
        )
      ) : undefined}

      {description &&
        (fallbackLanguage ? (
          <Paragraph className={`${styles.truncateTo3Lines} ingress`} lang={fallbackLanguage}>
            {description}
          </Paragraph>
        ) : (
          <Paragraph className={`${styles.truncateTo3Lines} ingress`}>{description}</Paragraph>
        ))}

      {tagsList && <div className={styles.tagsList}>{tagsList}</div>}
    </Card>
  );
};

export { SearchHit };
