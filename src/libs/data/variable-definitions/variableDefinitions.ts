'use server';

import { getM2mToken } from '@/libs/auth/m2m';
import { localization } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLoggerWithBindings } from '@/libs/logger/server-logger';
import {
  getStaticVariableDefinitionById,
  getStaticVariableDefinitionByShortName,
  getStaticVariableDefinitions,
} from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';
import { getEncodedJwt } from '../../auth/jwt';
import {
  GetVariableDefinitionByIdRequest,
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

const ttlSeconds = Number(process.env.VARDEF_CACHE_TTL_SECONDS);

export async function getVardefClient(): Promise<VariableDefinitionsApi> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getVardefClient' });
  let token = process.env.SSB_DATAPORTAL_JWT_TOKEN;
  if (token) {
    logger.warn('Using hardcoded access token from environment! (SSB_DATAPORTAL_JWT_TOKEN)');
  } else if (process.env.VARDEF_USE_M2M_TOKEN === 'true') {
    logger.debug('Using M2M token for Vardef auth');
    token = await getM2mToken(process.env.VARDEF_M2M_CLIENT_ID, process.env.VARDEF_M2M_CLIENT_SECRET);
  } else {
    token = await getEncodedJwt().catch((reason) => {
      logger.error({ error: sanitizeError(reason) }, 'JWT retrieval unexpectedly failed');
      return undefined;
    });
    if (!token) {
      logger.debug('No JWT token found in request headers');
      return Promise.reject('Could not retrieve access token!');
    }
    logger.debug('Successfully retrieved JWT from authorization header');
  }
  let configParams = {
    accessToken: token,
    headers: {
      'User-Agent': getUserAgent(),
    },
  } as ConfigurationParameters;
  const basePath = process.env.METADATA_API_BASE_PATH;
  if (basePath) {
    logger.debug({ basePath }, 'Vardef API base path configured');
    configParams.basePath = basePath;
  }
  return new VariableDefinitionsApi(new Configuration(configParams));
}

export async function listRenderedVariableDefinitions(): Promise<Array<RenderedView>> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'listRenderedVariableDefinitions' });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticVariableDefinitions();
  }

  const api = await getVardefClient();
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies ListVariableDefinitionsRequest;
  let data: RenderedView[] = [];

  try {
    const startTime = Date.now();
    let rawData = await api.listVariableDefinitions(params, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
    const durationMs = Date.now() - startTime;
    data = rawData.filter((each) => instanceOfRenderedView(each));
    logger.info({ count: data.length, durationMs }, 'Fetched variable definitions from API');
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
  return data;
}

export async function getVariableDefinitionByShortName(shortName: string): Promise<RenderedView> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getVariableDefinitionByShortName' });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    const variable = getStaticVariableDefinitionByShortName(shortName);
    if (!variable) return Promise.reject('Not found');
    return variable;
  }

  const api = await getVardefClient();
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
    if (data == undefined || !instanceOfRenderedView(data)) {
      logger.error({ shortName: shortName, data: data }, 'Response could not be decoded to RenderedView');
      throw new Error('Could not decode data');
    }
    logger.info({ id: data.id, shortName: data.short_name }, 'Fetched variable definition');
    return data;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
}
export async function getRenderedVariableDefinitionById(id: string): Promise<RenderedView | undefined> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getRenderedVariableDefinitionById' });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticVariableDefinitionById(id);
  }

  const api = await getVardefClient();
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    variableDefinitionId: id,
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies GetVariableDefinitionByIdRequest;

  try {
    const data = await api.getVariableDefinitionById(params);
    if (data !== undefined && !instanceOfRenderedView(data)) {
      logger.error({ id: id, data: data }, 'Response could not be decoded to RenderedView');
      throw new Error('Could not decode data');
    }
    logger.info({ id: data.id, shortName: data.short_name }, 'Fetched variable definition');
    return data;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      if (error.response.status === 404) {
        return undefined;
      }
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    }
    throw error;
  }
}
