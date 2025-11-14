import styles from './search-hit.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Url } from 'next/dist/shared/lib/router/router';
import { Card } from '@digdir/designsystemet-react';
import { localization, getTranslateText as translate } from '@/utils/src';

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
      <Link href={titleHref ?? ''}>
        <h2 className={styles.title}>{translate(title) ? translate(title) : localization.concept.noName}</h2>
      </Link>

      {content}
    </Card>
  );
};

export { SearchHit };
