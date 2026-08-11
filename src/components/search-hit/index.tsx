import { Card, Heading, Link, Paragraph, Tag, Tooltip } from '@digdir/designsystemet-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { ReactNode } from 'react';
import { localization } from '@/libs/language';
import styles from './search-hit.module.css';

interface SearchHitProps {
  title?: string;
  href?: string;
  description?: string;
  tagsList?: ReactNode;
  notSelectedLanguage?: string;
}

const SearchHit = ({ title, href, description, tagsList, notSelectedLanguage }: SearchHitProps) => {
  return (
    <Card aria-label={title} role='article'>
      {notSelectedLanguage && (
        <div className={styles.hasNotValueInSelectedLanguage}>
          <Tooltip
            content={
              localization.formatString(localization.language.notSelectedLanguage, {
                item: localization.classification.labelSingular.toLocaleLowerCase(),
              }) as string
            }
          >
            <Tag data-size='lg' className={styles.languageTag}>
              <InformationSquareIcon />
              {notSelectedLanguage}
            </Tag>
          </Tooltip>
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
