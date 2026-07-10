import Link from 'next/link';
import { VersionItem, VersionsTable } from '@/app/(details)/classifications/components/versions-table';
import { ClassificationVersionSummaryResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language/src/localization';
import styles from './views.module.css';

interface VersionsViewProps {
  classificationId: number;
  versions: ClassificationVersionSummaryResource[];
}

const mapVersions = (v: ClassificationVersionSummaryResource, classificationId: number): VersionItem[] => [
  {
    label: localization.versions.name,
    value: <Link href={`/classifications/${classificationId}/version/${v.id}/codes`}>{v.name}</Link>,
  },
  {
    label: localization.versions.validFrom,
    value: v.validFrom,
  },
  {
    label: localization.versions.validTo,
    value: v.validTo ?? localization.versions.now,
  },
];

export default function VersionsView({ versions, classificationId }: Readonly<VersionsViewProps>) {
  return (
    <div className={styles.versionsWrapper}>
      <VersionsTable content={versions.map((v) => mapVersions(v, classificationId))} />
    </div>
  );
}
