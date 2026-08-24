import { Alert } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, ReactNode } from 'react';
import { buildUrl } from '@/app/(details)/classifications/utils/urls';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { localization, SupportedLanguage } from '@/libs/language/src/localization';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import ClassificationDetail from '../components/classificationDetail';
import { VersionProvider, VersionResourceLayer } from '../components/versionContext';
import { getRequestLanguageCached } from '../utils/languageUtils';

const showInfoOnly = process.env.HIDE_CLASSIFICATIONS === 'true';

const renderInfoOnlyPage = () => {
  return (
    <div className='container'>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[
          {
            text: localization.classification.labelPlural,
            href: buildUrl({}),
          },
        ]}
      />

      <Alert data-color={'warning'} className='infoAlert'>
        Detaljside for klassifikasjon er ikke klar for testing.
      </Alert>
    </div>
  );
};

const getPageData = cache(async (id: number) => {
  const logger = createLogger('classification-detail-page');
  const language = await getRequestLanguageCached();

  const classification = await fetchClassificationById(id, language as SupportedLanguage);
  logger.debug(`Fetched classification ${classification.name}`);
  return { classification, language };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { classification } = await getPageData(Number(id)).catch(() => ({
    classification: null,
  }));

  return { title: classification?.name ?? id };
}

export default async function ClassificationLayout({
  children,
  download,
  params,
}: Readonly<{
  children: ReactNode;
  download: ReactNode;
  params: Promise<{ id: string; versionNumber?: string }>;
}>) {
  const logger = createLogger('classification-detail-page');
  const { id, versionNumber } = await params;
  const classificationId = Number(id);
  const requestedVersionId = versionNumber !== undefined ? Number(versionNumber) : undefined;

  if (!Number.isInteger(classificationId)) {
    logger.warn({ id }, 'Invalid classification id param');
    return notFound();
  }

  const { classification, language } = await getPageData(classificationId).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification details');
    return notFound();
  });

  const hasVersions = (classification.versions ?? []).length > 0;
  if (!hasVersions) return notFound();

  // A version route must never fall back to the latest version or load a
  // version belonging to another classification.
  if (requestedVersionId !== undefined) {
    const belongsToClassification = classification.versions?.some((version) => version.id === requestedVersionId);
    if (!Number.isInteger(requestedVersionId) || !belongsToClassification) {
      logger.warn({ id, versionNumber }, 'Invalid version id param');
      return notFound();
    }
  }

  const latestSummary = [...(classification.versions ?? [])].sort(
    (a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0),
  )[0];

  if (!latestSummary) {
    return notFound();
  }

  const versionSummary =
    requestedVersionId !== undefined
      ? classification.versions?.find((version) => version.id === requestedVersionId)
      : latestSummary;

  if (!versionSummary) {
    return notFound();
  }

  const isLatest = latestSummary.id === versionSummary.id;

  const resolveLanguage = () => {
    return classification.fallbackLanguage
      ? (classification.fallbackLanguage as SupportedLanguage)
      : (language as SupportedLanguage);
  };
  let latestVersionResource;
  try {
    const resourceId = requestedVersionId ?? latestSummary.id;
    latestVersionResource = resourceId != null ? await fetchVersionById(resourceId, resolveLanguage()) : null;
  } catch (error) {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to fetch latest version resource');
    return notFound();
  }

  if (requestedVersionId !== undefined && latestVersionResource?.id !== requestedVersionId) {
    return notFound();
  }

  logger.info({ id }, 'Classification detail page access');

  if (showInfoOnly) {
    logger.info('Classification detail page is running in info-only mode');
    return renderInfoOnlyPage();
  }

  return (
    <VersionProvider classification={classification} versionSummary={versionSummary} isLatest={isLatest}>
      <VersionResourceLayer versionResource={latestVersionResource ?? undefined}>
        <ClassificationDetail classification={classification} classificationVersion={latestVersionResource}>
          {children}
        </ClassificationDetail>
        {download}
      </VersionResourceLayer>
    </VersionProvider>
  );
}
