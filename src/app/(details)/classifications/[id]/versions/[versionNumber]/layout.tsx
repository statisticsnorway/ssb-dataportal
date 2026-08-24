import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { VersionResourceLayer } from '@/app/(details)/classifications/components/versionContext';
import { getRequestLanguageCached } from '@/app/(details)/classifications/utils/languageUtils';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { SupportedLanguage } from '@/libs/language/src/localization';
import { createLogger } from '@/libs/logger/server-logger';

export default async function VersionLayout({
  children,
  download,
  params,
}: Readonly<{ children: ReactNode; download: ReactNode; params: Promise<{ id: string; versionNumber: string }> }>) {
  const logger = createLogger('version-page');
  const { id, versionNumber } = await params;
  const versionId = Number(versionNumber);
  const classificationId = Number(id);
  const language = await getRequestLanguageCached();
  if (Number.isNaN(versionId)) {
    logger.warn({ versionNumber }, 'Invalid versionNumber param');
    return notFound();
  }

  let versionResource;
  try {
    const classification = await fetchClassificationById(classificationId, language as SupportedLanguage);
    const resolvedLanguage = (classification?.fallbackLanguage as SupportedLanguage) ?? language;
    versionResource = await fetchVersionById(versionId, resolvedLanguage);
  } catch (error) {
    logger.error({ error, versionId }, 'Failed to fetch version by id');
    return notFound();
  }

  if (!versionResource) return notFound();

  return (
    <VersionResourceLayer versionResource={versionResource}>
      {children}
      {download}
    </VersionResourceLayer>
  );
}
