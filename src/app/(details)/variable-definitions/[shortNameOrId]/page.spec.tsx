import { beforeEach, expect, it, vi } from 'vitest';
import { getVariableDefinitionByShortName } from '@/libs/data/variable-definitions/variableDefinitions';
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

vi.mock('@/libs/data/variable-definitions/variableDefinitions', () => ({ getRenderedVariableDefinition: vi.fn() }));
vi.mock('./variableDefinitionDetail', () => ({ default: () => <div>VariableDefinitionDetail</div> }));

const params = Promise.resolve({ shortName: 'test' });

beforeEach(() => {
  vi.clearAllMocks();
});

it('calls notFound when variable definition fetch fails', async () => {
  vi.mocked(getVariableDefinitionByShortName).mockRejectedValue(new Error('Not found'));
  await expect(VariableDefinition({ params })).rejects.toThrow('NOT_FOUND');
});
