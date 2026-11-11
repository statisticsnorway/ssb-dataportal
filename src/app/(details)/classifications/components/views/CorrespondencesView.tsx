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
  /**
   * Only set when the URL already pins a version. Leaving it out keeps the
   * correspondence links version-free, so they follow the default (newest)
   * version the same way the surrounding tab does. A version-pinned tab must
   * pass it: its tables may not exist on the default version, and a
   * version-free link would then resolve to a 404.
   */
  versionId?: number;
}

export default function CorrespondencesView({
  classificationId,
  classificationVersion,
  versionId,
}: Readonly<CorrespondencesViewProps>) {
  const correspondences = (classificationVersion?.correspondenceTables ?? []).filter(
    (correspondence) => correspondence.changeTable !== true,
  );
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
