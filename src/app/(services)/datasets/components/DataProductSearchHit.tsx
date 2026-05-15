import { Card, Heading, Link, Tag } from '@digdir/designsystemet-react';
import { tabsData } from '@/app/(services)/tabs';
import { DataProductDTO } from '@/libs/data-access/datadoc/models';

import styles from './dataProduct.module.css';

export const DataProductSearchHit = ({ dataProduct }: { dataProduct: DataProductDTO }) => (
  <Card>
    <Heading data-size='md'>
      <Link
        href={`${tabsData.Datasets.route}/${dataProduct.productShortName}`}
        className={styles.dataProductHeadingLink}
      >
        {dataProduct.title}
      </Link>
    </Heading>
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
      <Tag data-color='success' data-size='md'>
        {dataProduct.productShortName}
      </Tag>
    </div>
  </Card>
);
