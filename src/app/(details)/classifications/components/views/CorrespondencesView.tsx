import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { ClassificationCard } from '@/app/(details)/classifications/components/classification-cards';
import { ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import type { Item } from '@/types/item';
import styles from './views.module.css';

function levelName(level?: { levelName?: string; levelNumber?: number }) {
  return level?.levelName ?? (level?.levelNumber !== undefined ? String(level.levelNumber) : '—');
}

export default function CorrespondencesView({
  classificationId,
  version,
  isLatest,
}: Readonly<{ classificationId: number; version: ClassificationVersionResource; isLatest: boolean }>) {
  const correspondences = version.correspondenceTables ?? [];

  return (
    <div className={styles.aboutWrapper}>
      <header>
        <Heading className='secondaryHeading' data-size='md' level={2}>
          {localization.correspondences.heading}
        </Heading>
        <Paragraph>{localization.correspondences.description}</Paragraph>
      </header>

      {correspondences.length === 0 ? (
        <Alert data-color='info' role='status'>
          {localization.correspondences.empty}
        </Alert>
      ) : (
        correspondences.map((correspondence) => (
          <ClassificationCard
            key={correspondence.id ?? correspondence.name}
            title={
              <Link
                href={`/correspondences/${correspondence.id}${
                  isLatest
                    ? `?returnTo=/classifications/${classificationId}/correspondences`
                    : `?returnTo=/classifications/${classificationId}/version/${version.id}/correspondences`
                }`}
              >
                {correspondence.name ?? '—'}
              </Link>
            }
            content={
              [
                {
                  label: localization.correspondences.from,
                  value: correspondence.source ?? '—',
                },
                {
                  label: localization.correspondences.level,
                  value: levelName(correspondence.sourceLevel),
                },
                {
                  label: localization.correspondences.to,
                  value: correspondence.target ?? '—',
                },
                {
                  label: localization.correspondences.level,
                  value: levelName(correspondence.targetLevel),
                },
                {
                  label: localization.correspondences.owner,
                  value: correspondence.owningSection ?? '—',
                },
              ] satisfies Item[]
            }
          />
        ))
      )}
    </div>
  );
}
