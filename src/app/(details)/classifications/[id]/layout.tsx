import { Alert } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache, ReactNode } from 'react';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { ClassificationResource } from '@/libs/data-access/klass';
import { languageCookieName, resolveLanguage } from '@/libs/language';
import { localization } from '@/libs/language/src/localization';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import ClassificationDetail from '../components/classificationDetail';
import { VersionResourceLayer } from '../components/versionContext';

const showInfoOnly = process.env.HIDE_CLASSIFICATIONS === 'true';

const renderInfoOnlyPage = () => {
  return (
    <div className='container'>
      <DataportalBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[
          {
            text: localization.classification.labelPlural,
            href: `/classifications`,
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
  let classification: ClassificationResource | undefined = undefined;

  if (classification === undefined) {
    const cookieStore = await cookies();
    const requestHeaders = await headers();
    const language = resolveLanguage(
      cookieStore.get(languageCookieName)?.value,
      requestHeaders.get('accept-language') ?? undefined,
    );
    classification = await fetchClassificationById(id, language);
    logger.debug(`Fetched classification ${classification.name}`);
  }

  return { classification };
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
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const logger = createLogger('classification-detail-page');
  const { id } = await params;

  const { classification } = await getPageData(Number(id)).catch((error) => {
    logger.error({ id, error: sanitizeError(error) }, 'Failed to load classification details');
    return notFound();
  });

  const hasVersions = (classification.versions ?? []).length > 0;
  if (!hasVersions) return notFound();

  const latestSummary = [...(classification.versions ?? [])].sort(
    (a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0),
  )[0];

  const latestVersionResource =
    latestSummary?.id != null ? await fetchVersionById(latestSummary.id).catch(() => null) : null;

  logger.info({ id }, 'Classification detail page access');

  if (showInfoOnly) {
    logger.info('Classification detail page is running in info-only mode');
    return renderInfoOnlyPage();
  }

  return (
    <VersionResourceLayer versionResource={latestVersionResource ?? undefined}>
      <ClassificationDetail classification={classification}>{children}</ClassificationDetail>
    </VersionResourceLayer>
  );
}