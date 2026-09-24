import { beforeEach, expect, it, vi } from 'vitest';
import {
  getVariableDefinitionByShortName,
  getVariableDefinitionByShortNameAtDate,
  getVariableDefinitionValidityPeriodsById,
} from '@/libs/data/variable-definitions/variableDefinitions';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { getStaticVariableDefinitions } from '@/utils/mock-data';
import VariableDefinition from './page';

vi.mock('server-only', () => ({}));
vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));
vi.mock('@/libs/logger/sanitize', () => ({ sanitizeError: vi.fn((e) => e) }));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

vi.mock('@/libs/data/variable-definitions/variableDefinitions', () => ({
  getVariableDefinitionByShortNameAtDate: vi.fn(),
  getVariableDefinitionByShortName: vi.fn(),
  getVariableDefinitionValidityPeriodsById: vi.fn(),
}));
vi.mock('./variableDefinitionDetail', () => ({ default: () => <div>VariableDefinitionDetail</div> }));

const params = Promise.resolve({ shortNameOrId: 'test' });
const searchParams = Promise.resolve({});

beforeEach(() => {
  vi.clearAllMocks();
});

it('calls notFound when variable definition fetch fails', async () => {
  vi.mocked(getVariableDefinitionValidityPeriodsById).mockResolvedValue([]);
  vi.mocked(getVariableDefinitionByShortName).mockRejectedValue(new Error('Not found'));
  await expect(VariableDefinition({ params, searchParams })).rejects.toThrow('NOT_FOUND');
});

it('uses validAt query param to resolve selected validity period', async () => {
  const base = getStaticVariableDefinitions()[0] as RenderedView;
  const oldPeriod = {
    id: 'period-old',
    valid_from: new Date('1984-01-01'),
    valid_until: new Date('2024-12-31'),
  };
  const newPeriod = {
    id: 'period-new',
    valid_from: new Date('2025-01-01'),
    valid_until: undefined,
  };

  vi.mocked(getVariableDefinitionByShortName).mockResolvedValue({
    ...base,
    short_name: 'aksje',
    id: newPeriod.id,
    valid_from: newPeriod.valid_from,
    valid_until: newPeriod.valid_until,
  });
  vi.mocked(getVariableDefinitionValidityPeriodsById).mockResolvedValue([oldPeriod, newPeriod]);
  vi.mocked(getVariableDefinitionByShortNameAtDate).mockResolvedValue({
    ...base,
    id: oldPeriod.id,
    short_name: 'aksje',
    valid_from: oldPeriod.valid_from,
    valid_until: oldPeriod.valid_until,
  });

  await VariableDefinition({
    params,
    searchParams: Promise.resolve({ validAt: '1984-01-01' }),
  });

  expect(getVariableDefinitionByShortNameAtDate).toHaveBeenCalledWith('aksje', oldPeriod.valid_from);
});
