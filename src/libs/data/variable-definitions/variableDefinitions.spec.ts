import assert from 'node:assert';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { VariableDefinitionsApi } from '@/libs/data-access/variable-definitions/internal/apis/VariableDefinitionsApi';
import { getStaticVariableDefinitions as getStaticVariableDefinitions } from '@/utils/mock-data';
import {
  getVardefClient,
  getVariableDefinitionByShortName,
  listRenderedVariableDefinitions,
} from './variableDefinitions';

const staticDefs = getStaticVariableDefinitions();

vi.mock('server-only', () => ({}));

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
      // noinspection ES6RedundantAwait
      await expect(getVardefClient()).rejects.toThrow('Could not retrieve access token!');
    });
    it('hardcoded token', () => {
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      process.env.METADATA_API_BASE_PATH = 'my-cool-base-path';
      getVardefClient().then((client) => {
        expect(client).toBeInstanceOf(VariableDefinitionsApi);
        // @ts-ignore only protected access in test
        const tokenReturn = client.configuration.accessToken?.();
        if (tokenReturn instanceof Promise) {
          tokenReturn.then((token: String) => {
            expect(token).toEqual(process.env.SSB_DATAPORTAL_JWT_TOKEN);
          });
        }
        // @ts-ignore only protected access in test
        expect(client.configuration.basePath).toEqual(process.env.METADATA_API_BASE_PATH);
      });
    });
  });
  describe('listRenderedVariableDefinitions', () => {
    it('static data', async () => {
      vi.stubEnv('VARDEF_USE_STATIC_DATA', 'true');
      // noinspection ES6RedundantAwait
      await expect(listRenderedVariableDefinitions()).resolves.toContainEqual(staticDefs[0]);
      vi.unstubAllEnvs();
    });
    it('no token available', async () => {
      process.env.VARDEF_USE_STATIC_DATA = 'false';
      // noinspection ES6RedundantAwait
      await expect(listRenderedVariableDefinitions()).rejects.toThrow('Could not retrieve access token!');
    });
    it('mock api call happy path', () => {
      process.env.VARDEF_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';

      vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue(staticDefs);

      listRenderedVariableDefinitions().then((result) => {
        expect(result).toContainEqual(staticDefs[2]);
      });
    });
  });
  describe('getRenderedVariableDefinition', () => {
    it('static data', async () => {
      vi.stubEnv('VARDEF_USE_STATIC_DATA', 'true');
      // noinspection ES6RedundantAwait
      await expect(getVariableDefinitionByShortName('antall')).resolves.toEqual(staticDefs[5]);
      vi.stubEnv('VARDEF_USE_STATIC_DATA', 'true');
    });
    it('no token available', async () => {
      process.env.VARDEF_USE_STATIC_DATA = 'false';
      // noinspection ES6RedundantAwait
      await expect(getVariableDefinitionByShortName('antall')).rejects.toThrow('Could not retrieve access token!');
    });
    it('mock api call happy path', () => {
      process.env.VARDEF_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      let variable = staticDefs[5];
      assert(variable);
      vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue([variable]);

      getVariableDefinitionByShortName('antall').then((result) => {
        expect(result).toEqual(staticDefs[5]);
      });
    });
    it('throws an error if multiple variable definitions are returned', async () => {
      process.env.VARDEF_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      let variable1 = staticDefs[5];
      assert(variable1);
      let variable2 = staticDefs[5];
      assert(variable2);
      vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue([variable1, variable2]);
      // noinspection ES6RedundantAwait
      await expect(getVariableDefinitionByShortName('antall')).rejects.toThrow(
        'Multiple variable definitions found for shortName="antall"',
      );
    });
    it('throws an error if no variable definitions are returned', async () => {
      process.env.VARDEF_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';

      vi.spyOn(VariableDefinitionsApi.prototype, 'listVariableDefinitions').mockResolvedValue([]);
      // noinspection ES6RedundantAwait
      await expect(getVariableDefinitionByShortName('antall')).rejects.toThrow(
        'No variable definition found for shortName="antall"',
      );
    });
  });
});
