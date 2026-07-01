import { Alert } from '@digdir/designsystemet-react';
import { redirect } from 'next/navigation';
import { createLogger } from '@/libs/logger/server-logger';

const showInfoOnly = process.env.HIDE_CLASSIFICATIONS === 'true';

const renderInfoOnlyPage = () => {
  return (
    <Alert data-color={'warning'} className='infoAlert'>
      Detaljside for klassifikasjon er ikke klar for testing.
    </Alert>
  );
};

export default async function ClassificationPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const logger = createLogger('classification-details-page');
  logger.info({ params }, 'Classification detail page access');
  if (showInfoOnly) {
    logger.info('Classification detail page is running in info-only mode');
    return renderInfoOnlyPage();
  }
  const { id } = await params;
  redirect(`/classifications/${id}/codes`);
}
