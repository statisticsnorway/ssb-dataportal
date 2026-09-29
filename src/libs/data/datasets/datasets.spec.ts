import assert from 'node:assert';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getEncodedJwt } from '@/libs/auth/jwt';
import { getM2mToken } from '@/libs/auth/m2m';
import {
  DaplaDataFileDTO,
  DataFilesApi,
  DataProductDTO,
  DataProductDTOFromJSON,
  DataProductsApi,
  DatasetDTO,
  DatasetDTOFromJSON,
  DatasetsApi,
} from '@/libs/data-access/datadoc';
import dataProducts from '@/static-data/data-products.json';
import datasetsStatic from '@/static-data/datasets.json';
import {
  getClientForApi,
  getDataProductByShortName,
  listDataFilesByDatasetId,
  listDataProducts,
  listDatasets,
  listDatasetsByProductShortName,
} from './datasets';

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
      await expect(getClientForApi(DataProductsApi)).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('hardcoded token', async () => {
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      process.env.METADATA_API_BASE_PATH = 'my-cool-base-path';
      const client = await getClientForApi(DataProductsApi);
      expect(client).toBeInstanceOf(DataProductsApi);
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
      const client = await getClientForApi(DatasetsApi);
      expect(client).toBeInstanceOf(DatasetsApi);
      // @ts-ignore only protected access in test
      const tokenReturn = client.configuration.accessToken?.();
      const token = await tokenReturn;
      expect(token).toEqual('m2m-token');
    });
  });

  describe('listDataProducts', () => {
    it('static data', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(listDataProducts()).resolves.toContainEqual(DataProductDTOFromJSON(dataProducts[0]));
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
      vi.spyOn(DataProductsApi.prototype, 'listDataProducts').mockResolvedValue(dataProducts as DataProductDTO[]);
      const result = await listDataProducts();
      expect(result).toContainEqual((dataProducts as DataProductDTO[])[0]);
    });
  });

  describe('getDataProductByShortName', () => {
    const testProduct = DataProductDTOFromJSON(dataProducts[0]);
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
      await expect(getDataProductByShortName('non-existent-product')).rejects.toMatchObject({ message: 'Not found' });
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
      vi.spyOn(DataProductsApi.prototype, 'getDataProductByShortName').mockResolvedValue(testProduct);
      const result = await getDataProductByShortName(shortName);
      expect(result).toEqual(testProduct);
    });
  });

  describe('listDatasetsByProductShortName', () => {
    const testDataset = DatasetDTOFromJSON(datasetsStatic[1]);
    assert(testDataset);
    const shortName = testDataset.product_short_name;
    assert(shortName);

    it('static data', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(listDatasetsByProductShortName(shortName)).resolves.toContainEqual(testDataset);
      vi.unstubAllEnvs();
    });

    it('no token available', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(listDatasetsByProductShortName(shortName)).rejects.toEqual(
        new Error('Could not retrieve access token!'),
      );
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      const mockResult = [testDataset];
      vi.spyOn(DatasetsApi.prototype, 'listDatasets').mockResolvedValue(mockResult);
      const result = await listDatasetsByProductShortName(shortName);
      expect(result).toEqual(mockResult);
    });
  });

  describe('listDataFilesByDatasetId', () => {
    it('static data uses datafiles/<datasetId>.json and converts dates', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');

      const result = await listDataFilesByDatasetId('id1');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]?.product_short_name).toEqual('arblonn');
      expect(result[0]?.contains_data_from).toBeInstanceOf(Date);

      vi.unstubAllEnvs();
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';

      const mockResult = [
        {
          file_path: 'gs://bucket/path/file.parquet',
          file_name: 'file.parquet',
          naming_standard_violations: [],
        } as DaplaDataFileDTO,
      ];
      vi.spyOn(DataFilesApi.prototype, 'listDataFiles').mockResolvedValue(mockResult);

      const result = await listDataFilesByDatasetId('dataset-id');
      expect(result).toEqual(mockResult);
    });
    it('static data returns empty array when no file exists', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');

      await expect(listDataFilesByDatasetId('does-not-exist')).resolves.toEqual([]);

      vi.unstubAllEnvs();
    });
  });

  describe('listDatasets', () => {
    const staticDatasets = datasetsStatic as DatasetDTO[];
    const testDataset = staticDatasets[0];
    assert(testDataset);

    it('static data', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(listDatasets()).resolves.toContainEqual(testDataset);
      vi.unstubAllEnvs();
    });

    it('no token available', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(listDatasets()).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      vi.spyOn(DatasetsApi.prototype, 'listDatasets').mockResolvedValue(staticDatasets);
      const result = await listDatasets();
      expect(result).toEqual(staticDatasets);
    });
  });
});
