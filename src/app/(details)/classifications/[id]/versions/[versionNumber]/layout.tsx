import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { getRequestLanguage } from '@/app/(details)/classifications/[id]/layout';
import { VersionResourceLayer } from '@/app/(details)/classifications/components/versionContext';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { createLogger } from '@/libs/logger/server-logger';

export default async function VersionLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ id: string; versionNumber: string }> }>) {
  const logger = createLogger('version-page');
  const { id, versionNumber } = await params;
  const versionId = Number(versionNumber);
  const classificationId = Number(id);
  const language = await getRequestLanguage();
  if (Number.isNaN(versionId)) {
    logger.warn({ versionNumber }, 'Invalid versionNumber param');
    return notFound();
  }

  let versionResource;
  try {
    const classification = await fetchClassificationById(classificationId, language);
    const resolvedLanguage = classification?.fallbackLanguage ?? language;
    versionResource = await fetchVersionById(versionId, resolvedLanguage);
  } catch (error) {
    logger.error({ error, versionId }, 'Failed to fetch version by id');
    return notFound();
  }

  if (!versionResource) return notFound();

  if (!versionResource) return notFound();

  return <VersionResourceLayer versionResource={versionResource}>{children}</VersionResourceLayer>;
}
