import { Alert } from '@digdir/designsystemet-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, ReactNode } from 'react';
import { DataportalBreadcrumbs } from '@/components/dataportal-breadcrumbs';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { ClassificationResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language/src/localization';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import ClassificationDetail from '../components/classificationDetail';

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
    classification = await fetchClassificationById(id);
    logger.debug(`Fetched classification ${classification.name}`);
  }

  return { classification };
});

function resolveLatestVersion(classification: ClassificationResource) {
  const versions = classification.versions ?? [];
  if (versions.length === 0) return null;
  return [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0))[0] ?? null;
}

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

  const latestVersion = resolveLatestVersion(classification);
  if (!latestVersion) {
    logger.warn({ id }, 'Classification has no versions');
    return notFound();
  }

  logger.info({ id }, 'Classification detail page access');

  if (showInfoOnly) {
    logger.info('Classification detail page is running in info-only mode');
    return renderInfoOnlyPage();
  }

  return (
    <ClassificationDetail classification={classification}>
      {children}
    </ClassificationDetail>
  );
}
