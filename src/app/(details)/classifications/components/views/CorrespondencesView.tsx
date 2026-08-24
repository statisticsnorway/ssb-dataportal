import { Alert, Heading } from '@digdir/designsystemet-react';
import { mapCorrespondenceItems } from '@/app/(details)/classifications/utils/correspondences';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import { ClassificationCard } from '../classification-cards';
import styles from './views.module.css';

interface CorrespondencesViewProps {
  classificationId: number;
  classificationVersion: ClassificationVersionResource;
}

export default function CorrespondencesView({
  classificationId,
  classificationVersion,
}: Readonly<CorrespondencesViewProps>) {
  const correspondences = (classificationVersion?.correspondenceTables ?? []).filter(
    (correspondence) => correspondence.changeTable !== true,
  );
  const versionId = classificationVersion.id;
  return (
    <div className={styles.aboutWrapper}>
      <header>
        <Heading className='secondaryHeading' data-size='md' level={2}>
          {localization.classification.correspondence.heading}
        </Heading>
        <p>{localization.classification.correspondence.info}</p>
      </header>
      {correspondences.length === 0 ? (
        <Alert role='status' data-color='info'>
          {localization.classification.correspondence.none}
        </Alert>
      ) : (
        correspondences.map((correspondence) => {
          const href = buildUrl({ classificationId, versionId, correspondenceId: correspondence.id });
          return (
            <ClassificationCard
              key={correspondence.id}
              title={correspondence.name}
              content={mapCorrespondenceItems(correspondence)}
              href={href}
            />
          );
        })
      )}
    </div>
  );
}
