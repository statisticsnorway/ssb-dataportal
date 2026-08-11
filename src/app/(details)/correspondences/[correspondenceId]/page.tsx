import { notFound } from 'next/navigation';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { fetchCorrespondenceTableById } from '@/libs/data/classifications/versionsData';
import { createLogger } from '@/libs/logger/server-logger';
import CorrespondenceDetailView from './CorrespondenceDetailView';

function getSafeReturnTo(value?: string) {
  return value?.startsWith('/classifications/') && !value.startsWith('//') ? value : '/classifications';
}

export default async function CorrespondenceDetail({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ correspondenceId: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}>) {
  const { correspondenceId } = await params;
  const id = Number(correspondenceId);
  if (!Number.isInteger(id)) return notFound();

  const logger = createLogger('correspondence-detail-page');
  const language = await getRequestLanguage();
  const table = await fetchCorrespondenceTableById(id, language).catch((error) => {
    logger.error({ error, id }, 'Failed to load correspondence table');
    return undefined;
  });

  if (!table) return notFound();

  const { returnTo } = await searchParams;
  return <CorrespondenceDetailView table={table} returnTo={getSafeReturnTo(returnTo)} />;
}
