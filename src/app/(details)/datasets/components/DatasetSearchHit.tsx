import { Card, Heading, Link } from '@digdir/designsystemet-react';
import { type ReactNode } from 'react';
import styles from '@/app/(services)/datasets/components/dataProduct.module.css';
import { tabsData } from '@/app/(services)/tabs';
import { DatasetDTO } from '@/libs/data-access/datadoc/models';

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
  const route = `${tabsData.Datasets.route}/${dataset.product_short_name}/${dataset.id}`;

  return (
    <Card data-testid='dataset-search-card'>
      <Heading data-size='md' className={styles.dataProductHeadingLink}>
        <HeadingLink href={route}>
          <span className='heading12'>{dataset.short_description ?? dataset.id}</span>
        </HeadingLink>
      </Heading>

      {/* product short name tag removed by request */}
    </Card>
  );
};
