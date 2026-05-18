import { Card, Heading, Link } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';
import { tabsData } from '@/app/(services)/tabs';
import { DatasetDTO } from '@/libs/data-access/datadoc/models';
import styles from './datasetSearchHit.module.css';

interface HeadingLinkProps {
  readonly href: string;
  readonly children: ReactNode;
}

const HeadingLink = ({ href, children }: HeadingLinkProps) => (
  <Link href={href} className={styles.dataProductHeadingLink}>
    {children}
  </Link>
);

interface DatasetSearchHitProps {
  readonly dataset: DatasetDTO;
}

export const DatasetSearchHit = ({ dataset }: DatasetSearchHitProps) => {
  const route = `${tabsData.DataProducts.route}/${dataset.product_short_name}/datasets/${dataset.id}`;

  return (
    <Card data-testid='dataset-search-card'>
      <Heading data-size='md' className={styles.dataProductHeadingLink}>
        <HeadingLink href={route}>
          <span className='heading12'>{dataset.short_description ?? dataset.id}</span>
        </HeadingLink>
      </Heading>
    </Card>
  );
};
