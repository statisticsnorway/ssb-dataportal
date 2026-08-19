import { notFound } from 'next/navigation';

import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { fetchCorrespondenceTable } from '@/libs/data/classifications/correspondencesData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import styles from './correspondences.module.css';

interface CorrespondencePageProps {
  params: Promise<{
    id: string;
    versionNumber: string;
    correspondenceId: string;
  }>;
}

export default async function CorrespondencePage({ params }: CorrespondencePageProps) {
  const { versionNumber, correspondenceId } = await params;

  const versionId = Number(versionNumber);
  const tableId = Number(correspondenceId);

  const language = await getRequestLanguage();

  const version = await fetchVersionById(versionId, language);

  if (!version) {
    return notFound();
  }

  const table = await fetchCorrespondenceTable(tableId, language);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{table.source}</h1>
      <h2 className={styles.subtitle}>{table.target}</h2>
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
