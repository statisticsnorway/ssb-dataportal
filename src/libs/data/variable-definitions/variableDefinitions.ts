'use server';

import { getVariableDefinitionById, getVariableDefinitions } from '@/utils/mock-data';
import { getEncodedJwt } from '../../auth/jwt';
import {
  GetVariableDefinitionByIdRequest,
  ListVariableDefinitionsRequest,
  VariableDefinitionsApi,
} from '../../data-access/variable-definitions/internal/apis';
import { instanceOfRenderedView, RenderedView } from '../../data-access/variable-definitions/internal/models';
import {
  Configuration,
  ConfigurationParameters,
  ResponseError,
} from '../../data-access/variable-definitions/internal/runtime';

export async function getVardefClient(): Promise<VariableDefinitionsApi> {
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
  return new VariableDefinitionsApi(new Configuration(configParams));
}

export async function listRenderedVariableDefinitions(): Promise<Array<RenderedView>> {
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    console.warn('Using static mock data for Vardef');
    return getVariableDefinitions();
  }

  const api = await getVardefClient();
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    acceptLanguage: 'nb',
    render: true,
  } satisfies ListVariableDefinitionsRequest;
  var data: RenderedView[] = [];

  try {
    let rawData = await api.listVariableDefinitions(params);
    data = rawData.filter((each) => instanceOfRenderedView(each));
    console.log(`Fetched ${data.length} variable definitions`);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      console.error(`Request to ${error.response.url} returned status code ${error.response.status}`);
    } else {
      console.error(error);
    }
    throw error;
  }
  return data;
}

export async function getRenderedVariableDefinition(id: string): Promise<RenderedView> {
  if (process.env.VARDEF_USE_STATIC_DATA === 'true') {
    console.warn('Using static mock data for Vardef');
    const variable = getVariableDefinitionById(id);
    if (!variable) return Promise.reject('Not found');
    return variable;
  }

  const api = await getVardefClient();
  if (!api) return Promise.reject('Could not access Vardef API!');

  const params = {
    variableDefinitionId: id,
    acceptLanguage: 'nb',
    render: true,
  } satisfies GetVariableDefinitionByIdRequest;
  var data: RenderedView | undefined = undefined;

  try {
    data = await api.getVariableDefinitionById(params).then((rawData) => {
      if (instanceOfRenderedView(rawData)) {
        return rawData;
      }
      console.error(`Received data which could not be decoded to RenderedView: ${rawData}`);
      throw Error('Could not decode data');
    });
    console.log(`Fetched variable definition ID: ${data?.short_name} short name: ${data?.short_name}`);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      console.error(`Request to ${error.response.url} returned status code ${error.response.status}`);
    } else {
      console.error(error);
    }
    throw error;
  }
  if (!data) return Promise.reject('Could not retrieve variable');
  return data;
}
