import Link from 'next/link';
import { ClassificationVersionSummaryResource } from '@/libs/data-access/klass';

interface VersionsViewProps {
  classificationId: number;
  versions: ClassificationVersionSummaryResource[];
}

export default function VersionsView({ classificationId, versions }: Readonly<VersionsViewProps>) {
  return (
    <div>
      {versions.map((version) => (
        <div key={version.id}>
          <Link href={`/classifications/${classificationId}/version/${version.id}/codes`}>{version.name}</Link>
          <span>
            {version.validFrom?.getFullYear()} – {version.validTo?.getFullYear() ?? 'nå'}
          </span>
        </div>
      ))}
    </div>
  );
}
