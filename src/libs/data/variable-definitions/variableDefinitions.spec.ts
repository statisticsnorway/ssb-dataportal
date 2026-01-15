import { VariableDefinitionsApi } from '@/libs/data-access/variable-definitions/internal/apis';
import { getVariableDefinitions as getStaticVariableDefinitions } from '@/utils/mock-data';
import { getVardefClient, listRenderedVariableDefinitions } from './variableDefinitions';

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({ get: () => 'blah' }),
}));
const ORIGINAL_ENV = process.env;
beforeEach(() => {
  // Allow independently modifying process.env in tests
  // by resetting it before each
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterAll(() => {
  process.env = ORIGINAL_ENV; // Restore old environment
});

describe('vardef data fetching', () => {
  it('getVardefClient no token available', () => {
    expect(getVardefClient()).rejects.toEqual('Could not retrieve access token!');
  });
  it('getVardefClient hardcoded token', () => {
    process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';
    process.env.VARDEF_BASE_PATH = 'my-cool-base-path';
    getVardefClient().then((client) => {
      expect(client).toBeInstanceOf(VariableDefinitionsApi);
      const tokenReturn = client.configuration.accessToken?.();
      if (tokenReturn instanceof Promise) {
        tokenReturn.then((token: String) => {
          expect(token).toEqual(process.env.METADATA_CATALOG_JWT_TOKEN);
        });
      }
      expect(client.configuration.basePath).toEqual(process.env.VARDEF_BASE_PATH);
    });
  });
  it('listRenderedVariableDefinitions static data', () => {
    expect(listRenderedVariableDefinitions()).resolves.toContainEqual(getStaticVariableDefinitions()[0]);
  });
  it('listRenderedVariableDefinitions no token available', () => {
    process.env.VARDEF_USE_STATIC_DATA = 'false';
    expect(listRenderedVariableDefinitions()).rejects.toEqual('Could not retrieve access token!');
  });
});
