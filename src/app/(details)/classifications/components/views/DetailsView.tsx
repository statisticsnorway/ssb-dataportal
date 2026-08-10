'use client';

import { mapDetailsItems } from '@/app/(details)/classifications/utils/details';

import { DetailsTable } from '@/components/details-list';
import { ClassificationResource, ClassificationVersionResource } from '@/libs/data-access/klass/models';
import styles from './views.module.css';

interface DetailsViewProps {
  classification: ClassificationResource;
  classificationVersion: ClassificationVersionResource;
}
export default function DetailsView({ classification, classificationVersion }: Readonly<DetailsViewProps>) {
  return (
    <div className={styles.aboutWrapper}>
      <DetailsTable content={mapDetailsItems(classificationVersion, classification)} />
    </div>
  );
}
