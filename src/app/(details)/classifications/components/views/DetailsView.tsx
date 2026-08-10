'use client';

import { mapDetailsItems } from '@/app/(details)/classifications/utils/details';
import { DetailsList } from '@/components/details-list';
import { ClassificationResource, ClassificationVersionResource } from '@/libs/data-access/klass/models';
import styles from './views.module.css';

interface DetailsViewProps {
  classification: ClassificationResource;
  classificationVersion: ClassificationVersionResource;
}
export default function DetailsView({ classification, classificationVersion }: Readonly<DetailsViewProps>) {
  return (
    <div className={styles.aboutWrapper}>
      <DetailsList content={mapDetailsItems(classificationVersion, classification)} />
    </div>
  );
}
