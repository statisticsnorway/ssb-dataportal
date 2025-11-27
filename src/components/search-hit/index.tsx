import { Card, Heading } from '@digdir/designsystemet-react';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import { ReactNode } from 'react';
import { nb, getTranslateText as translate } from '@/libs/language';
import styles from './search-hit.module.css';

interface SearchHitProps {
  title: string[] | string;
  rightColumn?: ReactNode;
  content?: ReactNode;
  titleHref?: Url;
  labels?: ReactNode;
  tags?: ReactNode[];
}

const SearchHit = ({ title, content, titleHref }: SearchHitProps) => {
  return (
    <Card>
      <Card.Block>
      <Link href={titleHref ?? ''} className={styles.link}>
        <Heading level={2} data-size='sm' className={styles.title}>{title}</Heading>
      </Link>
      {content}
      </Card.Block>
    </Card>
  );
};

export { SearchHit };
