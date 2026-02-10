import { cache } from 'react';
import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';

const CACHE_TTL = 5 * 60 * 1000;
let cachedData: RenderedView[] | null = null;
let lastFetchTime = 0;

export const getVariableDefinitionsCached = cache(async (): Promise<RenderedView[]> => {
  const now = Date.now();

  if (!cachedData || now - lastFetchTime > CACHE_TTL) {
    cachedData = await listRenderedVariableDefinitions();
    lastFetchTime = now;
  }

  return cachedData;
});
