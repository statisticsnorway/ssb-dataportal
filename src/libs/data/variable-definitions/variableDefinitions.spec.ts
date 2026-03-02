import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { VariableDefinitionsApi } from '@/libs/data-access/variable-definitions/internal/apis/VariableDefinitionsApi';
import { getVariableDefinitions as getStaticVariableDefinitions } from '@/utils/mock-data';
import { getRenderedVariableDefinition, getVardefClient, listRenderedVariableDefinitions } from './variableDefinitions';

const staticDefs = getStaticVariableDefinitions();

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  // Allow independently modifying process.env in tests
  // by resetting it before each
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterAll(() => {
  process.env = ORIGINAL_ENV; // Restore old environment
});

describe('vardef data fetching', () => {
  describe('getVardefClient', () => {
    it('no token available', async () => {
      await expect(getVardefClient()).rejects.toEqual('Could not retrieve access token!');
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
        vi.stubEnv('VARDEF_USE_STATIC_DATA', 'true');
        expect(listRenderedVariableDefinitions()).resolves.toContainEqual(staticDefs[0]);
        vi.unstubAllEnvs();
      }, 6000);
      it('no token available', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        expect(listRenderedVariableDefinitions()).rejects.toEqual('Could not retrieve access token!');
      });
      it('mock api call happy path', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';

        vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue(staticDefs);

        listRenderedVariableDefinitions().then((result) => {
          expect(result).toContainEqual(staticDefs[2]);
        });
      });
    }),
    describe('getRenderedVariableDefinition', () => {
      it('static data', () => {
        vi.stubEnv('VARDEF_USE_STATIC_DATA', 'true');
        expect(getRenderedVariableDefinition('antall')).resolves.toEqual(staticDefs[5]);
        vi.stubEnv('VARDEF_USE_STATIC_DATA', 'true');
      });
      it('no token available', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        expect(getRenderedVariableDefinition('antall')).rejects.toEqual('Could not retrieve access token!');
      });
      it('mock api call happy path', () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';

        vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue([staticDefs[5]]);

        getRenderedVariableDefinition('antall').then((result) => {
          expect(result).toEqual(staticDefs[5]);
        });
      });
      it('throws an error if multiple variable definitions are returned', async () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';

        vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue([
          staticDefs[5],
          staticDefs[6],
        ]);

        await expect(getRenderedVariableDefinition('antall')).rejects.toThrow(
          'Multiple variable definitions found for shortName="antall"',
        );
      });
      it('throws an error if no variable definitions are returned', async () => {
        process.env.VARDEF_USE_STATIC_DATA = 'false';
        process.env.METADATA_CATALOG_JWT_TOKEN = 'my-cool-token';

        vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue([]);

        await expect(getRenderedVariableDefinition('antall')).rejects.toThrow(
          'No variable definition found for shortName="antall"',
        );
      });
    });
});
