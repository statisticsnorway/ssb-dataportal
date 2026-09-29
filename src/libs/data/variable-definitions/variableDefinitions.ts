'use server';

import { getM2mToken } from '@/libs/auth/m2m';
import { localization } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLoggerWithBindings } from '@/libs/logger/server-logger';
import {
  getStaticVariableDefinitionValidityPeriodsById as getStaticValidityPeriodsById,
  getStaticVariableDefinitionById,
  getStaticVariableDefinitionByShortName,
  getStaticVariableDefinitions,
  getStaticVariableDefinitionsByShortName,
} from '@/utils/mock-data';
import { getUserAgent } from '@/utils/userAgent';
import { getEncodedJwt } from '../../auth/jwt';
import {
  GetVariableDefinitionByIdRequest,
  ListValidityPeriodsRequest,
  ListVariableDefinitionsRequest,
  ValidityPeriodsApi,
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

export type VariableDefinitionValidityPeriod = Pick<RenderedView, 'id' | 'valid_from' | 'valid_until'>;

function isVariableDefinitionValidOnDate(
  variableDefinition: Pick<RenderedView, 'valid_from' | 'valid_until'>,
  date: Date,
) {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const validFrom = new Date(variableDefinition.valid_from);
  validFrom.setHours(0, 0, 0, 0);

  if (validFrom.getTime() > target.getTime()) {
    return false;
  }

  if (!variableDefinition.valid_until) {
    return true;
  }

  const validUntil = new Date(variableDefinition.valid_until);
  validUntil.setHours(0, 0, 0, 0);
  return validUntil.getTime() >= target.getTime();
}

function createVardefConfiguration(token: string): Configuration {
  let configParams = {
    accessToken: token,
    headers: {
      'User-Agent': getUserAgent(),
    },
  } as ConfigurationParameters;

  const basePath = process.env.METADATA_API_BASE_PATH;
  if (basePath) {
    configParams.basePath = basePath;
  }

  return new Configuration(configParams);
}

async function resolveVardefToken(logger: ReturnType<typeof createLoggerWithBindings>): Promise<string> {
  let token = process.env.SSB_DATAPORTAL_JWT_TOKEN;
  if (token) {
    logger.warn('Using hardcoded access token from environment! (SSB_DATAPORTAL_JWT_TOKEN)');
    return token;
  }

  if (process.env.VARDEF_USE_M2M_TOKEN === 'true') {
    logger.debug('Using M2M token for Vardef auth');
    token = await getM2mToken(process.env.VARDEF_M2M_CLIENT_ID, process.env.VARDEF_M2M_CLIENT_SECRET);
    if (!token) {
      throw new Error('Could not retrieve access token!');
    }
    return token;
  }

  token = await getEncodedJwt().catch((reason) => {
    logger.error({ error: sanitizeError(reason) }, 'JWT retrieval unexpectedly failed');
    return undefined;
  });

  if (!token) {
    logger.debug('No JWT token found in request headers');
    throw new Error('Could not retrieve access token!');
  }

  logger.debug('Successfully retrieved JWT from authorization header');
  return token;
}

export async function getVardefClient(): Promise<VariableDefinitionsApi> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getVardefClient' });
  const token = await resolveVardefToken(logger);
  return new VariableDefinitionsApi(createVardefConfiguration(token));
}

async function getValidityPeriodsClient(): Promise<ValidityPeriodsApi> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getValidityPeriodsClient' });
  const token = await resolveVardefToken(logger);
  return new ValidityPeriodsApi(createVardefConfiguration(token));
}

export async function listRenderedVariableDefinitions(language: SupportedLanguages): Promise<Array<RenderedView>> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'listRenderedVariableDefinitions' });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticVariableDefinitions();
  }

  const api = await getVardefClient();
  if (!api) throw new Error('Could not access Vardef API!');

  const params = {
    acceptLanguage: language,
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
    logger.info({ count: data.length, time: durationMs, params }, 'Fetched variable definitions from API');
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
    if (!variable) throw new Error('Not found');
    return variable;
  }

  const api = await getVardefClient();
  if (!api) throw new Error('Could not access Vardef API!');

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

export async function getVariableDefinitionByShortNameAtDate(
  shortName: string,
  dateOfValidity: Date,
): Promise<RenderedView | undefined> {
  const logger = createLoggerWithBindings({
    module: 'variable-definitions',
    fn: 'getVariableDefinitionByShortNameAtDate',
  });

  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticVariableDefinitionsByShortName(shortName).find((item) =>
      isVariableDefinitionValidOnDate(item, dateOfValidity),
    );
  }

  const api = await getVardefClient();
  if (!api) throw new Error('Could not access Vardef API!');

  const params = {
    shortName,
    dateOfValidity,
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies ListVariableDefinitionsRequest;

  try {
    const rawDataArray = await api.listVariableDefinitions(params);
    if (rawDataArray.length === 0) {
      return undefined;
    }
    if (rawDataArray.length > 1) {
      throw new Error(
        `Multiple variable definitions found for shortName="${shortName}" and date="${dateOfValidity.toISOString().slice(0, 10)}"`,
      );
    }

    const data = rawDataArray[0];
    if (data == undefined || !instanceOfRenderedView(data)) {
      logger.error({ shortName, data }, 'Response could not be decoded to RenderedView');
      throw new Error('Could not decode data');
    }

    logger.info(
      { id: data.id, shortName: data.short_name, dateOfValidity },
      'Fetched variable definition by short name and date',
    );
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

export async function getVariableDefinitionsByShortName(shortName: string): Promise<RenderedView[]> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getVariableDefinitionsByShortName' });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticVariableDefinitionsByShortName(shortName);
  }

  const api = await getVardefClient();
  if (!api) throw new Error('Could not access Vardef API!');

  const params = {
    shortName,
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    render: true,
  } satisfies ListVariableDefinitionsRequest;

  try {
    const rawDataArray = await api.listVariableDefinitions(params);
    const data = rawDataArray.filter(
      (item): item is RenderedView => item !== undefined && instanceOfRenderedView(item),
    );

    if (data.length !== rawDataArray.length) {
      logger.warn(
        { shortName, total: rawDataArray.length, decoded: data.length },
        'Some variable definitions could not be decoded to RenderedView',
      );
    }

    logger.info({ shortName, count: data.length }, 'Fetched variable definitions by short name');
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

export async function getValidityPeriodsById(id: string): Promise<VariableDefinitionValidityPeriod[]> {
  const logger = createLoggerWithBindings({
    module: 'variable-definitions',
    fn: 'getVariableDefinitionValidityPeriodsById',
  });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticValidityPeriodsById(id).map((item) => ({
      id: item.id,
      valid_from: item.valid_from,
      valid_until: item.valid_until,
    }));
  }

  const api = await getValidityPeriodsClient();
  if (!api) throw new Error('Could not access Vardef API!');

  const params = {
    variableDefinitionId: id,
  } satisfies ListValidityPeriodsRequest;

  try {
    const startTime = Date.now();
    const rawData = await api.listValidityPeriods(params, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
    const data = rawData.map((item) => ({
      id: item.id,
      valid_from: item.valid_from,
      valid_until: item.valid_until,
    }));
    const durationMs = Date.now() - startTime;
    logger.info({ id, count: data.length, time: durationMs }, 'Fetched variable definition validity periods');
    return data;
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, url: error.response.url }, 'API request failed');
    } else {
      logger.error({ id, error: sanitizeError(error) }, 'Failed to fetch variable definition validity periods');
    }
    throw error;
  }
}

export async function getRenderedVariableDefinitionById(
  id: string,
  dateOfValidity?: Date,
): Promise<RenderedView | undefined> {
  const logger = createLoggerWithBindings({ module: 'variable-definitions', fn: 'getRenderedVariableDefinitionById' });
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for vardef');
    return getStaticVariableDefinitionById(id);
  }

  const api = await getVardefClient();
  if (!api) throw new Error('Could not access Vardef API!');

  const params = {
    variableDefinitionId: id,
    acceptLanguage: localization.getLanguage() as SupportedLanguages,
    dateOfValidity,
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
