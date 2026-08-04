'use client';
import { Details, Heading, Paragraph } from '@digdir/designsystemet-react';
import { mapAboutItems, mapLevels } from '@/app/(details)/classifications/utils/about';
import { DetailsTable } from '@/components/details-list';
import {
  ClassificationResource,
  ClassificationVersionResource,
  ClassificationVersionSummaryResource,
} from '@/libs/data-access/klass/models';
import { VersionsTable } from '../versions-table';
import styles from './views.module.css';

interface AboutViewProps {
  classification: ClassificationResource;
  classificationSummary: ClassificationVersionSummaryResource;
  classificationVersion: ClassificationVersionResource;
}
export default function AboutView({ classification, classificationSummary, classificationVersion }: AboutViewProps) {
  return (
    <div className={styles.aboutWrapper}>
      <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='md' level={3}>
        {classificationSummary?.name ?? '—'}
      </Heading>
      <Paragraph>{classificationVersion?.introduction ?? '—'}</Paragraph>
      <DetailsTable content={mapAboutItems(classificationVersion, classification)} />
      <Details>
        <VersionsTable content={classificationVersion?.levels?.map((l) => mapLevels(l)) ?? []} />
      </Details>
    </div>
  );
}
