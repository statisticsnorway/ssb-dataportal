import { Link } from '@digdir/designsystemet-react';
import { VersionsTable } from '@/app/(details)/classifications/components/versions-table';
import { ClassificationVersionSummaryResource } from '@/libs/data-access/klass';
import { VersionItem } from '@/types/item';

interface VersionsViewProps {
  classificationId: number;
  versions: ClassificationVersionSummaryResource[];
}

const mapVersions = (v: ClassificationVersionSummaryResource, classificationId: number): VersionItem[] => [
  {
    label: 'Navn',
    value: <Link href={`/classifications/${classificationId}/version/${v.id}/codes`}>{v.name}</Link>,
  },
  {
    label: 'Gyldig fra',
    value: v.validFrom,
  },
  {
    label: 'Gyldig til',
    value: v.validTo ? v.validTo : 'Nå',
  },
];

export default function VersionsView({ versions, classificationId }: Readonly<VersionsViewProps>) {
  return (
    <div>
      <VersionsTable content={versions.map((v) => mapVersions(v, classificationId))} />
    </div>
  );
}
