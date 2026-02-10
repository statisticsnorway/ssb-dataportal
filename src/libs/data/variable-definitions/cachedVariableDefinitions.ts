import { cache } from 'react';
import { listRenderedVariableDefinitions } from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models';

const TTL = 5 * 60 * 1000;
let cachedData: RenderedView[] | null = null;
let lastFetch = 0;

export const getVariableDefinitionsCached = cache(async () => {
  const now = Date.now();

  if (!cachedData || now - lastFetch > TTL) {
    cachedData = await listRenderedVariableDefinitions();
    lastFetch = now;
  }

  return cachedData;
});
