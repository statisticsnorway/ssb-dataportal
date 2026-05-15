import assert from 'assert';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getEncodedJwt } from '@/libs/auth/jwt';
import { getM2mToken } from '@/libs/auth/m2m';
import { DefaultApi } from '@/libs/data-access/datadoc/apis';
import { DataProductDTO } from '@/libs/data-access/datadoc/models';
import dataProducts from '@/static-data/data-products.json';
import { getDataDocClient, getDataProductByShortName, listDataProducts } from './datasets';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/auth/m2m', () => ({
  getM2mToken: vi.fn(),
}));
vi.mock('@/libs/auth/jwt', () => ({
  getEncodedJwt: vi.fn(),
}));

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
  vi.clearAllMocks();
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('datadoc data fetching', () => {
  describe('getDataDocClient', () => {
    it('no token available', async () => {
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(getDataDocClient()).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('hardcoded token', async () => {
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      process.env.METADATA_API_BASE_PATH = 'my-cool-base-path';
      const client = await getDataDocClient();
      expect(client).toBeInstanceOf(DefaultApi);
      // @ts-ignore only protected access in test
      const tokenReturn = client.configuration.accessToken?.();
      const token = await tokenReturn;
      expect(token).toEqual(process.env.SSB_DATAPORTAL_JWT_TOKEN);
      // @ts-ignore only protected access in test
      expect(client.configuration.basePath).toEqual(process.env.METADATA_API_BASE_PATH);
    });

    it('M2M token', async () => {
      process.env.DATADOC_USE_M2M_TOKEN = 'true';
      vi.mocked(getM2mToken).mockResolvedValue('m2m-token');
      const client = await getDataDocClient();
      expect(client).toBeInstanceOf(DefaultApi);
      // @ts-ignore only protected access in test
      const tokenReturn = client.configuration.accessToken?.();
      const token = await tokenReturn;
      expect(token).toEqual('m2m-token');
    });
  });

  describe('listDataProducts', () => {
    it('static data', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(listDataProducts()).resolves.toContainEqual((dataProducts as DataProductDTO[])[0]);
      vi.unstubAllEnvs();
    });

    it('no token available', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(listDataProducts()).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';

      vi.spyOn(DefaultApi.prototype, 'listDataProducts').mockResolvedValue(dataProducts as DataProductDTO[]);

      const result = await listDataProducts();
      expect(result).toContainEqual((dataProducts as DataProductDTO[])[0]);
    });
  });

  describe('getDataProductByShortName', () => {
    const staticProducts = dataProducts as DataProductDTO[];
    const testProduct = staticProducts[0];
    assert(testProduct);
    const shortName = testProduct.product_short_name;
    assert(shortName);

    it('static data', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(getDataProductByShortName(shortName)).resolves.toEqual(testProduct);
      vi.unstubAllEnvs();
    });

    it('static data - not found', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(getDataProductByShortName('non-existent-product')).rejects.toEqual('Not found');
      vi.unstubAllEnvs();
    });

    it('no token available', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(getDataProductByShortName(shortName)).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';

      vi.spyOn(DefaultApi.prototype, 'getByShortName').mockResolvedValue(testProduct);

      const result = await getDataProductByShortName(shortName);
      expect(result).toEqual(testProduct);
    });
  });
});
