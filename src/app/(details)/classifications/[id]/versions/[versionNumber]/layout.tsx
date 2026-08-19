import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { VersionResourceLayer } from '@/app/(details)/classifications/components/versionContext';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { createLogger } from '@/libs/logger/server-logger';

export default async function VersionLayout({
  children,
  modal,
  params,
}: Readonly<{ children: ReactNode; modal: ReactNode; params: Promise<{ versionNumber: string }> }>) {
  const logger = createLogger('version-page');
  const { versionNumber } = await params;
  const versionId = Number(versionNumber);
  const language = await getRequestLanguage();
  if (Number.isNaN(versionId)) {
    logger.warn({ versionNumber }, 'Invalid versionNumber param');
    return notFound();
  }

  let versionResource;
  try {
    versionResource = await fetchVersionById(versionId, language);
  } catch (error) {
    logger.error({ error, versionId }, 'Failed to fetch version by id');
    return notFound();
  }

  if (!versionResource) return notFound();

  return (
    <VersionResourceLayer versionResource={versionResource}>
      {children}
      {modal}
    </VersionResourceLayer>
  );
}
