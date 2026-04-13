import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticateUser } from '@/libs/auth/userAuth';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { getVariableDefinitions } from '@/utils/mock-data';
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

vi.mock('@/libs/auth/userAuth', () => ({ authenticateUser: vi.fn() }));
vi.mock('@/libs/data/variable-definitions/variableDefinitions', () => ({ getRenderedVariableDefinition: vi.fn() }));
vi.mock('./variableDefinitionDetail', () => ({ default: () => <div>VariableDefinitionDetail</div> }));

const baseVariable = getVariableDefinitions()[0]!;
const params = Promise.resolve({ shortName: 'test' });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('VariableDefinition page', () => {
  describe('unauthenticated user', () => {
    beforeEach(() => {
      vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    });

    it('calls notFound when variable definition fetch fails', async () => {
      vi.mocked(getRenderedVariableDefinition).mockRejectedValue(new Error('Not found'));
      await expect(VariableDefinition({ params })).rejects.toThrow('NOT_FOUND');
    });

    it.each(['DRAFT', 'PUBLISHED_INTERNAL'] as const)('calls notFound for %s variable', async (variable_status) => {
      vi.mocked(getRenderedVariableDefinition).mockResolvedValue({ ...baseVariable, variable_status });
      await expect(VariableDefinition({ params })).rejects.toThrow('NOT_FOUND');
    });

    it('renders for PUBLISHED_EXTERNAL variable', async () => {
      vi.mocked(getRenderedVariableDefinition).mockResolvedValue({
        ...baseVariable,
        variable_status: 'PUBLISHED_EXTERNAL',
      });
      await expect(VariableDefinition({ params })).resolves.toBeDefined();
    });
  });

  it('renders for authenticated user with DRAFT variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: true });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({ ...baseVariable, variable_status: 'DRAFT' });
    await expect(VariableDefinition({ params })).resolves.toBeDefined();
  });
});
