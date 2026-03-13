'use server';

import { localization } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
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

const logger = createLogger('variable-definitions');

import {
  Configuration,
  ConfigurationParameters,
  ResponseError,
} from '../../data-access/variable-definitions/internal/runtime';

const ttl = Number(process.env.VARDEF_CACHE_TTL);

export async function getVardefClient(): Promise<VariableDefinitionsApi> {
  let token = process.env.SSB_DATAPORTAL_JWT_TOKEN;
  if (token) {
    logger.warn('Using hardcoded access token from environment! (SSB_DATAPORTAL_JWT_TOKEN)');
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
  } as ConfigurationParameters;
  const basePath = process.env.VARDEF_BASE_PATH;
  if (basePath) {
    logger.debug({ basePath }, 'Vardef API base path configured');
    configParams.basePath = basePath;
  }
  return new VariableDefinitionsApi(new Configuration(configParams));
}

export async function listRenderedVariableDefinitions(): Promise<Array<RenderedView>> {
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'listRenderedVariableDefinitions' }, 'Using static mock data for vardef');
    return getVariableDefinitions();
  }

  const api = await getVardefClient();
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies ListVariableDefinitionsRequest;
  var data: RenderedView[] = [];

  try {
    const startTime = Date.now();
    let rawData = await api.listVariableDefinitions(params, {
      cache: 'force-cache',
      next: { revalidate: ttl },
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

export async function getRenderedVariableDefinition(shortName: string): Promise<RenderedView> {
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn({ fn: 'getRenderedVariableDefinition' }, 'Using static mock data for vardef');
    const variable = getVariableDefinitionByShortName(shortName);
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
