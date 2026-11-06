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
  DatasetVariableDTO,
  PeriodFormat,
  StorageCategory,
} from '@/libs/data-access/datadoc';
import dataProducts from '@/static-data/data-products.json';
import datasetsStatic from '@/static-data/datasets.json';
import {
  getClientForApi,
  getDataProductByShortName,
  listDataFilesByDatasetIdAndStorageCategory,
  listDataProducts,
  listDatasetsByProductShortNameAndStorageCategory,
  listDatasetVariables,
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
      await expect(
        listDatasetsByProductShortNameAndStorageCategory(shortName, testDataset.storage_category!),
      ).resolves.toContainEqual(testDataset);
      vi.unstubAllEnvs();
    });

    it('no token available', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(
        listDatasetsByProductShortNameAndStorageCategory(shortName, testDataset.storage_category!),
      ).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      const mockResult = [testDataset];
      vi.spyOn(DatasetsApi.prototype, 'listDatasets').mockResolvedValue({
        datasets: mockResult,
        total_datasets: mockResult.length,
        page: 0,
        page_size: 100,
        has_next: false,
      });
      const result = await listDatasetsByProductShortNameAndStorageCategory(shortName, testDataset.storage_category!);
      expect(result).toEqual(mockResult);
    });
    it('fetches and combines all API pages', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';

      const secondDataset = DatasetDTOFromJSON(datasetsStatic[2]);
      assert(secondDataset);

      const listDatasetsSpy = vi.spyOn(DatasetsApi.prototype, 'listDatasets');
      const totalDatasets = 2;
      listDatasetsSpy
        .mockResolvedValueOnce({
          datasets: [testDataset],
          total_datasets: 2,
          page: 0,
          page_size: 100,
          has_next: true,
        })
        .mockResolvedValueOnce({
          datasets: [secondDataset],
          total_datasets: 2,
          page: 1,
          page_size: 100,
          has_next: false,
        });

      const result = await listDatasetsByProductShortNameAndStorageCategory(
        testDataset.product_short_name as string,
        testDataset.storage_category!,
      );

      expect(result).toEqual([testDataset, secondDataset]);
      expect(result).toHaveLength(totalDatasets);
      expect(listDatasetsSpy).toHaveBeenCalledTimes(2);
      expect(listDatasetsSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ page: 0 }), expect.anything());
      expect(listDatasetsSpy).toHaveBeenNthCalledWith(2, expect.objectContaining({ page: 1 }), expect.anything());
    });
  });

  describe('listDataFilesByDatasetId', () => {
    it('static data uses datafiles/<datasetId>.json and converts dates', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');

      const result = await listDataFilesByDatasetIdAndStorageCategory('id1', StorageCategory.SHARED);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]?.product_short_name).toEqual('arblonn');
      expect(result[0]?.contains_data_from).toBeInstanceOf(Date);

      vi.unstubAllEnvs();
    });

    it('loads the local monthly and quarterly timeline examples', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');

      const [monthly, quarterly] = await Promise.all([
        listDataFilesByDatasetIdAndStorageCategory('period-demo-monthly', StorageCategory.PRODUCT),
        listDataFilesByDatasetIdAndStorageCategory('period-demo-quarterly', StorageCategory.PRODUCT),
      ]);

      expect(monthly).toHaveLength(24);
      expect(monthly.every((file) => file.period_type === PeriodFormat.YEAR_MONTH)).toBe(true);
      expect(quarterly).toHaveLength(20);
      expect(quarterly.every((file) => file.period_type === PeriodFormat.QUARTER)).toBe(true);
      await expect(listDatasetVariables('period-demo-monthly')).resolves.toHaveLength(1);
      await expect(listDatasetVariables('period-demo-quarterly')).resolves.toHaveLength(1);

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

      const listDataFilesSpy = vi.spyOn(DataFilesApi.prototype, 'listDataFiles').mockResolvedValue({
        data_files: mockResult,
        total_data_files: mockResult.length,
        page: 0,
        page_size: 100,
        has_next: false,
      });

      const result = await listDataFilesByDatasetIdAndStorageCategory('dataset-id', StorageCategory.SHARED, [
        'variable-1',
      ]);
      expect(result).toEqual(mockResult);
      expect(listDataFilesSpy).toHaveBeenCalledWith(
        {
          datasetId: 'dataset-id',
          storageCategory: StorageCategory.SHARED,
          variableIds: ['variable-1'],
          page: 0,
          pageSize: 100,
        },
        expect.anything(),
      );
    });

    it('static data returns empty array when no file exists', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');

      await expect(
        listDataFilesByDatasetIdAndStorageCategory('does-not-exist', StorageCategory.SHARED),
      ).resolves.toEqual([]);

      vi.unstubAllEnvs();
    });
  });

  describe('listDatasetVariables', () => {
    it('returns the static Datadoc variable response for the ameld fixture dataset', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');

      const variables = await listDatasetVariables('id11');
      expect(variables).toHaveLength(12);
      expect(variables[0]).toEqual({
        id: '10000000-0000-4000-8000-000000000001',
        short_name: 'arbeidsforhold_id',
        physical_type: 'FIXED_LEN_BYTE_ARRAY',
        logical_type: 'UUID',
      });

      await expect(listDatasetVariables('unknown-dataset')).resolves.toEqual([]);

      vi.unstubAllEnvs();
    });

    it('fetches and combines all API pages', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      const variables = [
        { id: 'variable-1', short_name: 'person_id' },
        { id: 'variable-2', short_name: 'income' },
      ] as DatasetVariableDTO[];
      const listDatasetVariablesSpy = vi.spyOn(DatasetsApi.prototype, 'listDatasetVariables');
      listDatasetVariablesSpy
        .mockResolvedValueOnce({
          variables: [variables[0]!],
          total_variables: 2,
          page: 0,
          page_size: 1,
          has_next: true,
        })
        .mockResolvedValueOnce({
          variables: [variables[1]!],
          total_variables: 2,
          page: 1,
          page_size: 1,
          has_next: false,
        });

      await expect(listDatasetVariables('dataset-id')).resolves.toEqual(variables);
      expect(listDatasetVariablesSpy).toHaveBeenNthCalledWith(
        1,
        { id: 'dataset-id', page: 0, pageSize: 100 },
        expect.anything(),
      );
      expect(listDatasetVariablesSpy).toHaveBeenNthCalledWith(
        2,
        { id: 'dataset-id', page: 1, pageSize: 100 },
        expect.anything(),
      );
    });

    it('passes the period to the API', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      const listDatasetVariablesSpy = vi.spyOn(DatasetsApi.prototype, 'listDatasetVariables').mockResolvedValue({
        variables: [],
        total_variables: 0,
        page: 0,
        page_size: 100,
        has_next: false,
      });
      const from = new Date('2020-01-01');
      const until = new Date('2020-01-31');

      await listDatasetVariables('dataset-id', { from, until });

      expect(listDatasetVariablesSpy).toHaveBeenCalledWith(
        { id: 'dataset-id', containsDataFrom: from, containsDataUntil: until, page: 0, pageSize: 100 },
        expect.anything(),
      );
    });
  });

  describe('listDatasets', () => {
    const staticDatasets = datasetsStatic as DatasetDTO[];
    const testDataset = staticDatasets[0];
    assert(testDataset);

    it('static data', async () => {
      vi.stubEnv('DATADOC_USE_STATIC_DATA', 'true');
      await expect(
        listDatasetsByProductShortNameAndStorageCategory(
          testDataset.product_short_name as string,
          testDataset.storage_category!,
        ),
      ).resolves.toContainEqual(testDataset);
      vi.unstubAllEnvs();
    });

    it('no token available', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      vi.mocked(getEncodedJwt).mockResolvedValue(undefined);
      await expect(
        listDatasetsByProductShortNameAndStorageCategory(
          testDataset.product_short_name as string,
          testDataset.storage_category!,
        ),
      ).rejects.toEqual(new Error('Could not retrieve access token!'));
    });

    it('mock api call happy path', async () => {
      process.env.DATADOC_USE_STATIC_DATA = 'false';
      process.env.SSB_DATAPORTAL_JWT_TOKEN = 'my-cool-token';
      vi.spyOn(DatasetsApi.prototype, 'listDatasets').mockResolvedValue({
        datasets: staticDatasets,
        total_datasets: staticDatasets.length,
        page: 0,
        page_size: 100,
        has_next: false,
      });
      const result = await listDatasetsByProductShortNameAndStorageCategory(
        testDataset.product_short_name as string,
        testDataset.storage_category!,
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((d) => d.storage_location_name)).toBe(true);
    });
  });
});
