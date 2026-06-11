import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClassificationsApi } from '@/libs/data-access/klass/apis/ClassificationsApi';
import { ResponseError } from '@/libs/data-access/klass/runtime';
import classificationsMock from '@/static-data/classifications.json';
import { ClassificationType } from '@/types/classification';
import { getClassification as getStaticClassification } from '@/utils/mock-data';
import { fetchAllClassifications, fetchClassificationById } from './classificationData';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('classification data fetching', () => {
  describe('fetchAllClassifications', () => {
    it('static data', async () => {
      vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');
      const result = await fetchAllClassifications();
      expect(result).toHaveLength(classificationsMock.classifications.length);

      const firstStaticId = classificationsMock.classifications[0]?.id;
      expect(firstStaticId).toBeDefined();
      const firstStaticClassification = getStaticClassification(Number(firstStaticId));
      expect(firstStaticClassification).toBeDefined();
      expect(result).toContainEqual(firstStaticClassification);

      vi.unstubAllEnvs();
    });

    it('mock api call happy path', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classifications').mockResolvedValue({
        embedded: {
          classifications: [
            {
              id: 1,
              name: 'A',
              classificationType: ClassificationType.Klassifikasjon,
            },
          ],
        },
      });

      await expect(fetchAllClassifications()).resolves.toEqual([
        {
          id: 1,
          name: 'A',
          classificationType: ClassificationType.Klassifikasjon,
        },
      ]);
    });

    it('throws when pagination fetch fails', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classifications').mockResolvedValue({
        embedded: {
          classifications: [{ id: 1, name: 'A', classificationType: ClassificationType.Klassifikasjon }],
        },
        links: {
          next: { href: 'https://example.com/next-page' },
        },
      });

      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

      await expect(fetchAllClassifications()).rejects.toThrow('Failed to fetch classifications page');
    });
  });

  describe('fetchClassificationById', () => {
    it('static data', async () => {
      vi.stubEnv('KLASS_USE_STATIC_DATA', 'true');

      const staticId = classificationsMock.classifications[0]?.id;
      expect(staticId).toBeDefined();

      const expectedStaticClassification = getStaticClassification(Number(staticId));
      expect(expectedStaticClassification).toBeDefined();
      await expect(fetchClassificationById(Number(staticId))).resolves.toEqual(expectedStaticClassification);

      vi.unstubAllEnvs();
    });

    it('throws error when no classification is found', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(
        new ResponseError(new Response(null, { status: 404 }), 'Not found'),
      );

      await expect(fetchClassificationById(999)).rejects.toThrow('Not found');
    });

    it('throws ResponseError for non-404 status codes', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(
        new ResponseError(new Response(null, { status: 500 }), 'Internal Server Error'),
      );

      await expect(fetchClassificationById(1)).rejects.toThrow('Internal Server Error');
    });

    it('mock api call happy path', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockResolvedValue({
        id: 1,
        name: 'A',
        classificationType: ClassificationType.Klassifikasjon,
      });

      await expect(fetchClassificationById(1)).resolves.toEqual({
        id: 1,
        name: 'A',
        classificationType: ClassificationType.Klassifikasjon,
      });
    });

    it('throws unexpected non-response errors when fetching by id', async () => {
      process.env.KLASS_USE_STATIC_DATA = 'false';

      vi.spyOn(ClassificationsApi.prototype, 'classification').mockRejectedValue(new Error('Unexpected failure'));

      await expect(fetchClassificationById(1)).rejects.toThrow('Unexpected failure');
    });
  });
});
