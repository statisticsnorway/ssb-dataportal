'use server';

import { localization } from '@/libs/language';
import { getVariableDefinitionByShortName, getVariableDefinitions } from '@/utils/mock-data';
import { getEncodedJwt } from '../../auth/jwt';
import {
  ListVariableDefinitionsRequest,
  VariableDefinitionsApi,
} from '../../data-access/variable-definitions/internal/apis';
import {
  instanceOfRenderedView,
  RenderedView,
  SupportedLanguages,
} from '../../data-access/variable-definitions/internal/models';
import {
  Configuration,
  ConfigurationParameters,
  ResponseError,
} from '../../data-access/variable-definitions/internal/runtime';

export async function getVardefClient(options?: { cache?: boolean }): Promise<VariableDefinitionsApi> {
  const useCache = options?.cache !== false;
  let token = process.env.METADATA_CATALOG_JWT_TOKEN;
  if (token) {
    console.warn('Using hardcoded access token from environment! (METADATA_CATALOG_JWT_TOKEN)');
  } else {
    token = await getEncodedJwt().catch((reason) => {
      console.error(reason);
      return undefined;
    });
    if (!token) return Promise.reject('Could not retrieve access token!');
    console.debug('Got access token from authorization header');
  }
  let configParams = {
    accessToken: token,
  } as ConfigurationParameters;
  const basePath = process.env.VARDEF_BASE_PATH;
  if (basePath) {
    console.log(`Using Vardef base path: ${basePath}`);
    configParams.basePath = basePath;
  }

  return new VariableDefinitionsApi(
    new Configuration({
      ...configParams,
      fetchApi: (url, init) => {
        const cacheConfig = useCache
          ? { next: { revalidate: 300, tags: ['variable-definitions'] } }
          : { cache: 'no-store' as const };

        console.log(`${useCache ? '🟢 [CACHED]' : '🔴 [UNCACHED]'} Fetching: ${url}`);
        console.log(
          `${useCache ? '🟢 [CACHED]' : '🔴 [UNCACHED]'} Cache config:`,
          useCache ? 'revalidate: 300s, tags: [variable-definitions]' : 'no-store',
        );

        return fetch(url, {
          ...init,
          ...cacheConfig,
        });
      },
    }),
  );
}

export async function listRenderedVariableDefinitions(): Promise<Array<RenderedView>> {
  const startTime = performance.now();
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🟢 [CACHED] listRenderedVariableDefinitions() called');
  console.log('🕐 Time:', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════');
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    console.warn('Using static mock data for Vardef');
    return getVariableDefinitions();
  }
  const api = await getVardefClient({ cache: true });
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies ListVariableDefinitionsRequest;
  var data: RenderedView[] = [];

  try {
    let rawData = await api.listVariableDefinitions(params);
    data = rawData.filter((each) => instanceOfRenderedView(each));

    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`🟢 [CACHED] Fetched ${data.length} variable definitions`);
    console.log(`🟢 [CACHED] Duration: ${duration}ms`);
    if (parseFloat(duration) < 100) {
      console.log(`🟢 [CACHED] 🚀 FAST - Likely from cache!`);
    } else {
      console.log(`🟢 [CACHED] 🐌 SLOW - First call or cache expired`);
    }
    console.log('═══════════════════════════════════════════════════════\n');
  } catch (error: unknown) {
    const duration = (performance.now() - startTime).toFixed(2);
    console.error(`🟢 [CACHED] Error after ${duration}ms:`);
    if (error instanceof ResponseError) {
      console.error(`Request to ${error.response.url} returned status code ${error.response.status}`, error);
    } else {
      console.error(error);
    }
    console.log('═══════════════════════════════════════════════════════\n');
    throw error;
  }
  return data;
}

export async function getRenderedVariableDefinition(shortName: string): Promise<RenderedView> {
  const startTime = performance.now();
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🔴 [UNCACHED] getRenderedVariableDefinition() called');
  console.log('🔴 [UNCACHED] Short name:', shortName);
  console.log('🕐 Time:', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════');
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    console.warn('Using static mock data for Vardef');
    const variable = getVariableDefinitionByShortName(shortName);
    if (!variable) return Promise.reject('Not found');
    return variable;
  }

  const api = await getVardefClient({ cache: false });
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    shortName,
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies ListVariableDefinitionsRequest;

  try {
    const rawDataArray = await api.listVariableDefinitions(params);
    if (rawDataArray.length === 0) {
      throw new Error(`No variable definition found for shortName="${shortName}"`);
    }
    if (rawDataArray.length > 1) {
      throw new Error(`Multiple variable definitions found for shortName="${shortName}"`);
    }
    const data = rawDataArray[0];
    if (!instanceOfRenderedView(data)) {
      console.error(`Received data which could not be decoded to RenderedView:`, data);
      throw new Error('Could not decode data');
    }

    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`🔴 [UNCACHED] Fetched variable definition ID: ${data.id} short name: ${data.short_name}`);
    console.log(`🔴 [UNCACHED] Duration: ${duration}ms`);

    if (parseFloat(duration) < 100) {
      console.log(`🔴 [UNCACHED] ⚠️ UNEXPECTEDLY FAST - Should NOT be cached!`);
    } else {
      console.log(`🔴 [UNCACHED] ✅ SLOW - Correctly not cached`);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      console.error(`Request to ${error.response.url} returned status code ${error.response.status}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}
