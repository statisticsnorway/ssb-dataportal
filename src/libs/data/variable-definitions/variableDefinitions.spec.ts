import { VariableDefinitionsApi } from '@/libs/data-access/variable-definitions/internal/apis/VariableDefinitionsApi';
import { getVariableDefinitions as getStaticVariableDefinitions } from '@/utils/mock-data';
import { getRenderedVariableDefinition, getVardefClient, listRenderedVariableDefinitions } from './variableDefinitions';

const staticDefs = getStaticVariableDefinitions();

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
  describe('getVardefClient', () => {
    it('no token available', () => {
      expect(getVardefClient()).rejects.toEqual('Could not retrieve access token!');
    });
    it('hardcoded token', () => {
      process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';
      process.env.VARDEF_BASE_PATH = 'my-cool-base-path';
      getVardefClient().then((client) => {
        expect(client).toBeInstanceOf(VariableDefinitionsApi);
        // @ts-ignore only protected access in test
        const tokenReturn = client.configuration.accessToken?.();
        if (tokenReturn instanceof Promise) {
          tokenReturn.then((token: String) => {
            expect(token).toEqual(process.env.METADATA_CATALOG_JWT_TOKEN);
          });
        }
        // @ts-ignore only protected access in test
        expect(client.configuration.basePath).toEqual(process.env.VARDEF_BASE_PATH);
      });
    });
  }),
    describe('listRenderedVariableDefinitions', () => {
      it('static data', () => {
        expect(listRenderedVariableDefinitions()).resolves.toContainEqual(staticDefs[0]);
      });
      it('no token available', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        expect(listRenderedVariableDefinitions()).rejects.toEqual('Could not retrieve access token!');
      });
      it('mock api call happy path', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';

        jest.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue(staticDefs);

        listRenderedVariableDefinitions().then((result) => {
          expect(result).toContainEqual(staticDefs[2]);
        });
      });
    }),
    describe('getRenderedVariableDefinition', () => {
      it('static data', () => {
        expect(getRenderedVariableDefinition('Xd3Ueog_')).resolves.toEqual(staticDefs[5]);
      });
      it('no token available', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        expect(getRenderedVariableDefinition('Xd3Ueog_')).rejects.toEqual('Could not retrieve access token!');
      });
      it('mock api call happy path', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';

        jest.spyOn(VariableDefinitionsApi.prototype, 'getVariableDefinitionById').mockResolvedValue(staticDefs[5]);

        getRenderedVariableDefinition('Xd3Ueog_').then((result) => {
          expect(result).toEqual(staticDefs[5]);
        });
      });
    });
});
