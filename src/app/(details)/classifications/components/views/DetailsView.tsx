'use client';
import { mapAboutItems, mapChanges, mapLevels } from '@/app/(details)/classifications/utils/about';
import { DetailsTable } from '@/components/details-list';
import { ClassificationResource, ClassificationVersionResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { ClassificationVersionTable } from '../classification-version-table';
import { ExpandableTable } from '../expandable-table';
import styles from './views.module.css';

interface DetailsViewProps {
  classification: ClassificationResource;
  classificationVersion: ClassificationVersionResource;
}
export default function DetailsView({ classification, classificationVersion }: DetailsViewProps) {
  return (
    <div className={styles.aboutWrapper}>
      <DetailsTable content={mapAboutItems(classificationVersion, classification)} />
      <ExpandableTable
        title={localization.classification.about.levels}
        table={<ClassificationVersionTable content={classificationVersion?.levels?.map((l) => mapLevels(l)) ?? []} />}
      />
      <ExpandableTable
        title={localization.classification.about.changelog}
        table={
          classificationVersion?.changelogs?.length ? (
            <ClassificationVersionTable content={classificationVersion.changelogs.map((c) => mapChanges(c))} />
          ) : undefined
        }
        message={classificationVersion?.changelogs?.length ? undefined : localization.classification.about.noChanges}
      />
    </div>
  );
}
