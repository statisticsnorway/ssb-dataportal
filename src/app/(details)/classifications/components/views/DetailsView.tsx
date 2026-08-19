'use client';

import { mapDetailsItems } from '@/app/(details)/classifications/utils/details';
import { DetailsList } from '@/components/details-list';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models';
import styles from './views.module.css';

interface DetailsViewProps {
  classification: ClassificationWithLanguage;
  classificationVersion: ClassificationVersionResource;
}
export default function DetailsView({ classification, classificationVersion }: Readonly<DetailsViewProps>) {
  return (
    <div className={styles.aboutWrapper}>
      <DetailsList
        content={mapDetailsItems(classificationVersion, classification)}
        fallbackLanguage={classification.fallbackLanguage}
      />
    </div>
  );
}
