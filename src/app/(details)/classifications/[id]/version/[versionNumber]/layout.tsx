import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { VersionResourceLayer } from '@/app/(details)/classifications/components/versionContext';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { createLogger } from '@/libs/logger/server-logger';

export default async function VersionLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ versionNumber: string }> }>) {
  const logger = createLogger('version-page');
  const { versionNumber } = await params;
  const versionId = Number(versionNumber);
  if (Number.isNaN(versionId)) {
    logger.warn({ versionNumber }, 'Invalid versionNumber param');
    return notFound();
  }

  let versionResource;
  try {
    versionResource = await fetchVersionById(versionId);
  } catch (error) {
    logger.error({ error, versionId }, 'Failed to fetch version by id');
    return notFound();
  }

  if (!versionResource) return notFound();

  return <VersionResourceLayer versionResource={versionResource}>{children}</VersionResourceLayer>;
}
