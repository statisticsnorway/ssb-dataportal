import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { fetchVersionCodes } from '@/libs/data/classifications/codesData';
import { languageCookieName, resolveLanguage } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { CodesView } from '../../components/views/CodesView';

export default async function Codes({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('codes-page');
  const { id } = await params;
  const classificationId = Number(id);

  if (Number.isNaN(classificationId)) return notFound();

  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const language = resolveLanguage(
    cookieStore.get(languageCookieName)?.value,
    requestHeaders.get('accept-language') ?? undefined,
  );

  // Re-uses Next.js Data Cache — no extra network call, same fetch as layout
  const classification = await fetchClassificationById(classificationId, language).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification');
    return notFound();
  });

  const versions = classification.versions ?? [];
  const latestVersion = [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0))[0];

  if (!latestVersion?.id) return notFound();

  const codes = await fetchVersionCodes(latestVersion.id).catch((error) => {
    logger.error({ id, versionId: latestVersion.id, error: sanitizeError(error) }, 'Failed to load codes');
    return notFound();
  });

  return <CodesView codes={codes} />;
}
