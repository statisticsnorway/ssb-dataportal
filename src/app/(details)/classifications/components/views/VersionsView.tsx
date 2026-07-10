import { mapVersions } from '@/app/(details)/classifications/[id]/utils/versions';
import { VersionsTable } from '@/app/(details)/classifications/components/versions-table';
import { ClassificationVersionSummaryResource } from '@/libs/data-access/klass';
import styles from './views.module.css';

interface VersionsViewProps {
  classificationId: number;
  versions: ClassificationVersionSummaryResource[];
}

export default function VersionsView({ versions, classificationId }: Readonly<VersionsViewProps>) {
  return (
    <div className={styles.versionsWrapper}>
      <VersionsTable content={versions.map((v) => mapVersions(v, classificationId))} />
    </div>
  );
}
