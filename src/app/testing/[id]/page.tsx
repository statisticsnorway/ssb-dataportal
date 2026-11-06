import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { authenticateUser } from '@/libs/auth/userAuth';
import { listDatasetVariables } from '@/libs/data/datasets/datasets';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import VariableListShowcase from './variableListGallery';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Variable list design examples - ${id}` };
}

export default async function VariableListExamplesPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const auth = await authenticateUser();

  if (!auth.isAuthenticated) {
    notFound();
  }

  const logger = createLogger('variable-list-examples-page');
  let variables: DatasetVariableDTO[] = [];
  let hasError = false;

  try {
    variables = await listDatasetVariables(id);
  } catch (error: unknown) {
    hasError = true;
    logger.warn({ id, error: sanitizeError(error) }, 'Failed to load dataset variables for list examples');
  }

  return <VariableListShowcase datasetId={id} variables={variables} hasError={hasError} />;
}
