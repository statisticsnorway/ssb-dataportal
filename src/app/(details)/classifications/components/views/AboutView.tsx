'use client';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { mapAboutItems, mapChanges, mapLevels } from '@/app/(details)/classifications/utils/about';
import { DetailsTable } from '@/components/details-list';
import {
  ClassificationResource,
  ClassificationVersionResource,
  ClassificationVersionSummaryResource,
} from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { ExpandableTable } from '../expandable-table';
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
      <ExpandableTable
        title={localization.classification.about.levels}
        table={<VersionsTable content={classificationVersion?.levels?.map((l) => mapLevels(l)) ?? []} />}
      />
      <ExpandableTable
        title={localization.classification.about.changelog}
        table={
          classificationVersion?.changelogs?.length ? (
            <VersionsTable content={classificationVersion.changelogs.map((c) => mapChanges(c))} />
          ) : undefined
        }
        message={classificationVersion?.changelogs?.length ? undefined : localization.classification.about.noChanges}
      />
    </div>
  );
}
