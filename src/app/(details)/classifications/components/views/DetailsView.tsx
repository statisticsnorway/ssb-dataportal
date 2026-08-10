'use client';
import { mapLevels } from '@/app/(details)/classifications/utils/details';
import { ClassificationResource, ClassificationVersionResource } from '@/libs/data-access/klass/models';
import { localization } from '@/libs/language';
import { ClassificationTable } from '../classification-table';
import { ExpandableTable } from '../expandable-table';
import styles from './views.module.css';

interface DetailsViewProps {
  classification: ClassificationResource;
  classificationVersion: ClassificationVersionResource;
}
export default function DetailsView({ classification, classificationVersion }: Readonly<DetailsViewProps>) {
  return (
    <div className={styles.aboutWrapper}>
      <ExpandableTable
        title={localization.classification.about.levels}
        table={<ClassificationTable content={classificationVersion?.levels?.map((l) => mapLevels(l)) ?? []} />}
      />
    </div>
  );
}
