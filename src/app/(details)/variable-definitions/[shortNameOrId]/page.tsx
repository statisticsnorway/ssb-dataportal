import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import {
  getRenderedVariableDefinitionById as getVariableDefinitionById,
  getVariableDefinitionByShortName,
  getVariableDefinitionByShortNameAtDate,
  getVariableDefinitionValidityPeriodsById,
  VariableDefinitionValidityPeriod,
} from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import { getVardefApiDocsUrl } from '@/utils/config';
import { formatDate } from '@/utils/functions';
import VariableDefinitionDetail from './variableDefinitionDetail';

const variableDefinitionIdLength = 8;

function sortByValidityDesc<T extends { valid_from: Date }>(items: T[]) {
  return [...items].sort((a, b) => (b.valid_from?.getTime() ?? 0) - (a.valid_from?.getTime() ?? 0));
}

function resolveDefaultValidityPeriod<T extends { valid_from: Date; valid_until?: Date | null }>(
  items: T[],
): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const sorted = sortByValidityDesc(items);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validOnToday = sorted.find((item) => {
    const validFrom = new Date(item.valid_from);
    validFrom.setHours(0, 0, 0, 0);

    const validUntil = item.valid_until ? new Date(item.valid_until) : undefined;
    validUntil?.setHours(0, 0, 0, 0);

    if (validFrom.getTime() > today.getTime()) {
      return false;
    }

    return validUntil === undefined || validUntil.getTime() >= today.getTime();
  });

  if (validOnToday) {
    return validOnToday;
  }

  const beforeToday = sorted.find((item) => {
    const validFrom = new Date(item.valid_from);
    validFrom.setHours(0, 0, 0, 0);
    return validFrom.getTime() < today.getTime();
  });

  return beforeToday ?? sorted[0];
}

function resolveValidityPeriodByQuery(
  items: VariableDefinitionValidityPeriod[],
  validAt?: string,
): VariableDefinitionValidityPeriod | undefined {
  if (!validAt) {
    return resolveDefaultValidityPeriod(items);
  }

  const matched = items.find((item) => formatDate(item.valid_from) === validAt);
  return matched ?? resolveDefaultValidityPeriod(items);
}

/**
 * Fetches and caches page data for a variable definition by its short name OR ID.
 */
const getPageData = cache(async (shortNameOrId: string, validAt?: string) => {
  const logger = createLogger('variable-definition-detail-page');
  let variableDefinition: RenderedView;
  let validityPeriods: VariableDefinitionValidityPeriod[] = [];
  let baseVariableDefinition: RenderedView | undefined;

  if (shortNameOrId.length === variableDefinitionIdLength) {
    baseVariableDefinition = await getVariableDefinitionById(shortNameOrId);
    if (baseVariableDefinition !== undefined) {
      logger.debug(`Identified ${shortNameOrId} as ID, fetched variable definition ${baseVariableDefinition.name}`);
    }
  }

  if (baseVariableDefinition === undefined) {
    baseVariableDefinition = await getVariableDefinitionByShortName(shortNameOrId);
    logger.debug(
      `Identified ${shortNameOrId} as short name, fetched variable definition ${baseVariableDefinition.name}`,
    );
  }

  if (baseVariableDefinition === undefined) {
    throw new Error('No variable definition found');
  }

  validityPeriods = await getVariableDefinitionValidityPeriodsById(baseVariableDefinition.id);
  const selectedValidityPeriod = resolveValidityPeriodByQuery(validityPeriods, validAt);

  if (!selectedValidityPeriod) {
    variableDefinition = baseVariableDefinition;
  } else {
    variableDefinition =
      (await getVariableDefinitionByShortNameAtDate(
        baseVariableDefinition.short_name,
        selectedValidityPeriod.valid_from,
      )) ?? baseVariableDefinition;

    variableDefinition = {
      ...variableDefinition,
      valid_from: selectedValidityPeriod.valid_from,
      valid_until: selectedValidityPeriod.valid_until,
    };
  }

  if (validityPeriods.length === 0) {
    validityPeriods = [
      {
        id: baseVariableDefinition.id,
        valid_from: baseVariableDefinition.valid_from,
        valid_until: baseVariableDefinition.valid_until,
      },
    ];
  }

  const variableDefinitions = sortByValidityDesc(validityPeriods).map((period) => ({
    ...variableDefinition,
    id: period.id,
    valid_from: period.valid_from,
    valid_until: period.valid_until,
  }));

  return { variableDefinition, variableDefinitions };
});

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ shortNameOrId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { shortNameOrId } = await params;
  const query = await searchParams;
  const validAt = typeof query.validAt === 'string' ? query.validAt : undefined;
  const { variableDefinition } = await getPageData(shortNameOrId, validAt).catch(() => ({ variableDefinition: null }));
  return { title: variableDefinition?.name ?? shortNameOrId };
}

export default async function VariableDefinition({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ shortNameOrId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const logger = createLogger('variable-definition-detail-page');
  const { shortNameOrId } = await params;
  const query = await searchParams;
  const validAt = typeof query.validAt === 'string' ? query.validAt : undefined;
  logger.info({ shortNameOrId }, 'Variable definition detail page access');

  const { variableDefinition, variableDefinitions } = await getPageData(shortNameOrId, validAt).catch((error) => {
    logger.error({ shortNameOrId, error: sanitizeError(error) }, 'Failed to load variable definition details');
    return notFound();
  });

  const daplaLabVardefUrl: string | undefined = process.env.DAPLA_LAB_VARDEF_URL;

  return (
    <VariableDefinitionDetail
      variableDefinition={variableDefinition}
      variableDefinitions={variableDefinitions}
      daplaLabVardefUrl={daplaLabVardefUrl}
      apiDocsBaseUrl={getVardefApiDocsUrl()}
    />
  );
}
