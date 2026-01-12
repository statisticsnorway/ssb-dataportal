'use server';

import { getEncodedJwt } from '../auth/jwt';
import {
  ListVariableDefinitionsRequest,
  VariableDefinitionsApi,
} from '../data-access/variable-definitions/internal/apis';
import { instanceOfRenderedView, RenderedView } from '../data-access/variable-definitions/internal/models';
import {
  Configuration,
  ConfigurationParameters,
  ResponseError,
} from '../data-access/variable-definitions/internal/runtime';

async function getVardefClient(): Promise<VariableDefinitionsApi> {
  const token = await getEncodedJwt();
  if (!token) return Promise.reject('Could not retrieve access token!');
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
  const api = await getVardefClient();
  if (!api) return Promise.reject('Could not access Vardef API!');

  const body = {
    acceptLanguage: 'nb',
    render: true,
  } satisfies ListVariableDefinitionsRequest;
  const data = Promise.reject();

  try {
    const data = await api.listVariableDefinitions(body);
    data.filter((each) => instanceOfRenderedView(each));
    console.log(data);
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
