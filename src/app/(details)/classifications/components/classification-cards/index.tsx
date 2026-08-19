import { Card, Divider, Heading } from '@digdir/designsystemet-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { Item } from '@/types/item';
import styles from './classificationCards.module.css';

interface ClassificationCardProps {
  content: Item[];
  fallbackLanguage?: string;
  title?: string;
  href?: string;
}

/**
 * Renders a Card with column aligned description list
 *
 * @param param0
 * @returns
 */
const ClassificationCard = ({ content, title, href, fallbackLanguage }: Readonly<ClassificationCardProps>) => {
  const getColumnKey = (col: Item, index: number) => {
    const label = typeof col.label === 'string' && col.label.length > 0 ? col.label : 'column';
    return `${label}-${index}`;
  };

  return (
    <Card className={href ? styles.linkedCard : undefined}>
      {href && <Link className={styles.cardLink} href={href} aria-label={title} />}
      {title && (
        <Heading level={3} className={`${styles.detailsHeading} infoHeadingSecondary`} id={`tableHeading-${title}`}>
          <span className={styles.titleText} {...(fallbackLanguage ? { lang: fallbackLanguage } : {})}>
            {title}
          </span>
          <ArrowRightIcon className={styles.arrowIcon} aria-hidden='true' focusable='false' />
        </Heading>
      )}
      {content && content.length > 0 ? (
        <dl className={styles.grid}>
          {content.map((item, index) => (
            <div key={getColumnKey(item, index)} className={styles.item}>
              <dt className={styles.key}>{item.label}</dt>
              <Divider className={styles.divider} />
              <dd className={styles.value} {...(fallbackLanguage ? { lang: fallbackLanguage } : {})}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      <Divider />
    </Card>
  );
};

export { ClassificationCard };
