import { VersionsTable } from '@/app/(details)/classifications/components/versions-table';
import { mapVersions } from '@/app/(details)/classifications/utils/versions';
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
