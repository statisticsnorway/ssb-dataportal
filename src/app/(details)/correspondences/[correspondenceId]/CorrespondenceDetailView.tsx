'use client';

import {
  Alert,
  Heading,
  Paragraph,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@digdir/designsystemet-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CorrespondenceTableResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import styles from './correspondence-detail.module.css';

export default function CorrespondenceDetailView({
  table,
  returnTo,
}: Readonly<{ table: CorrespondenceTableResource; returnTo: string }>) {
  const [filter, setFilter] = useState('');
  const maps = table.correspondenceMaps ?? [];
  const filteredMaps = useMemo(() => {
    const normalizedFilter = filter.trim().toLocaleLowerCase();
    if (!normalizedFilter) return maps;

    return maps.filter((map) =>
      [map.sourceCode, map.sourceName, map.targetCode, map.targetName].some((value) =>
        value?.toLocaleLowerCase().includes(normalizedFilter),
      ),
    );
  }, [filter, maps]);

  return (
    <main className={`${styles.page} container`}>
      <Link className={styles.backLink} href={returnTo}>
        ← {localization.correspondences.detail.back}
      </Link>
      <Heading className='primaryHeading' data-size='lg' level={1}>
        {table.name ?? localization.correspondences.detail.heading}
      </Heading>
      <Paragraph>{table.description ?? localization.correspondences.detail.description}</Paragraph>

      <dl className={styles.metadata}>
        <div>
          <dt>{localization.correspondences.from}</dt>
          <dd>{table.source ?? '—'}</dd>
        </div>
        <div>
          <dt>{localization.correspondences.to}</dt>
          <dd>{table.target ?? '—'}</dd>
        </div>
        <div>
          <dt>{localization.correspondences.owner}</dt>
          <dd>{table.owningSection ?? '—'}</dd>
        </div>
        <div>
          <dt>{localization.correspondences.detail.contact}</dt>
          <dd>{table.contactPerson?.name ?? '—'}</dd>
        </div>
        <div>
          <dt>{localization.correspondences.detail.published}</dt>
          <dd>{table.published?.join(', ') ?? '—'}</dd>
        </div>
      </dl>

      <div className={styles.filterRow}>
        <label htmlFor='correspondence-filter'>{localization.correspondences.detail.filterLabel}</label>
        <input
          id='correspondence-filter'
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={localization.correspondences.detail.filterPlaceholder}
        />
      </div>

      {filteredMaps.length === 0 ? (
        <Alert data-color='info' role='status'>
          {localization.correspondences.detail.empty}
        </Alert>
      ) : (
        <Table border={true} zebra={false} hover={false} stickyHeader={true} className={styles.table}>
          <TableHead>
            <TableRow>
              <TableHeaderCell scope='col'>{localization.correspondences.detail.sourceCode}</TableHeaderCell>
              <TableHeaderCell scope='col'>{localization.correspondences.detail.sourceName}</TableHeaderCell>
              <TableHeaderCell scope='col'>{localization.correspondences.detail.targetCode}</TableHeaderCell>
              <TableHeaderCell scope='col'>{localization.correspondences.detail.targetName}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaps.map((map, index) => (
              <TableRow key={`${map.sourceCode}-${map.targetCode}-${index}`}>
                <TableCell className={styles.code}>{map.sourceCode ?? '—'}</TableCell>
                <TableCell>{map.sourceName ?? '—'}</TableCell>
                <TableCell className={styles.code}>{map.targetCode ?? '—'}</TableCell>
                <TableCell>{map.targetName ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
