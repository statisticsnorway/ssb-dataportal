import { Button } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { buildDownloadHref } from '@/app/(details)/classifications/utils/download-urls';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { localization } from '@/libs/language';
import styles from './correspondences.module.css';

interface CorrespondencePageProps {
  params: Promise<{
    id: string;
    versionNumber: string;
    correspondenceId: string;
  }>;
}

export default async function CorrespondencePage({ params }: CorrespondencePageProps) {
  const { id, versionNumber, correspondenceId } = await params;

  const versionId = Number(versionNumber);
  const tableId = Number(correspondenceId);

  const language = await getRequestLanguage();

  const version = await fetchVersionById(versionId, language);

  if (!version) {
    return notFound();
  }

  const table = await fetchCorrespondenceTable(tableId, language);

  const downloadHref = buildDownloadHref(
    `/classifications/${id}/versions/${versionNumber}/correspondences/${correspondenceId}`,
    { format: 'csv', language },
  );

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{table.source}</h1>
      <h2 className={styles.subtitle}>{table.target}</h2>
      <div className={styles.actions}>
        <Button asChild variant='secondary'>
          <Link href={downloadHref}>{localization.classification.download.button}</Link>
        </Button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fra</th>
              <th>Til</th>
            </tr>
          </thead>

          <tbody>
            {table.correspondenceMaps?.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.sourceCode} - {item.sourceName}
                </td>
                <td>
                  {item.targetCode} - {item.targetName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
