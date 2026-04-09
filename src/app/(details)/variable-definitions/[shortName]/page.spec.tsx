import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticateUser } from '@/libs/auth/userAuth';
import { getRenderedVariableDefinition } from '@/libs/data/variable-definitions/variableDefinitions';
import { getVariableDefinitions } from '@/utils/mock-data';
import VariableDefinition, { generateMetadata } from './page';

// Make React's cache() a passthrough so getPageData behaves as a plain async function in tests
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock('server-only', () => ({}));

// notFound() throws in Next.js — replicate that so rejects = notFound was called
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

vi.mock('@/libs/auth/userAuth', () => ({ authenticateUser: vi.fn() }));
vi.mock('@/libs/data/variable-definitions/variableDefinitions', () => ({ getRenderedVariableDefinition: vi.fn() }));
vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));
vi.mock('@/libs/logger/sanitize', () => ({ sanitizeError: vi.fn((e) => e) }));
vi.mock('./variableDefinitionDetail', () => ({ default: () => <div>VariableDefinitionDetail</div> }));

const baseVariable = getVariableDefinitions()[0]!;
const params = Promise.resolve({ shortName: 'test' });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('VariableDefinition page', () => {
  it('calls notFound when variable definition fetch fails', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockRejectedValue(new Error('Not found'));
    await expect(VariableDefinition({ params })).rejects.toThrow('NOT_FOUND');
  });

  it('calls notFound for unauthenticated user with DRAFT variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({ ...baseVariable, variable_status: 'DRAFT' });
    await expect(VariableDefinition({ params })).rejects.toThrow('NOT_FOUND');
  });

  it('calls notFound for unauthenticated user with PUBLISHED_INTERNAL variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({
      ...baseVariable,
      variable_status: 'PUBLISHED_INTERNAL',
    });
    await expect(VariableDefinition({ params })).rejects.toThrow('NOT_FOUND');
  });

  it('renders for unauthenticated user with PUBLISHED_EXTERNAL variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({
      ...baseVariable,
      variable_status: 'PUBLISHED_EXTERNAL',
    });
    await expect(VariableDefinition({ params })).resolves.toBeDefined();
  });

  it('renders for authenticated user with DRAFT variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: true });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({ ...baseVariable, variable_status: 'DRAFT' });
    await expect(VariableDefinition({ params })).resolves.toBeDefined();
  });
});

describe('generateMetadata', () => {
  it('returns shortName as title when fetch fails', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockRejectedValue(new Error('Not found'));
    await expect(generateMetadata({ params })).resolves.toEqual({ title: 'test' });
  });

  it('returns shortName as title for unauthenticated user with DRAFT variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({ ...baseVariable, variable_status: 'DRAFT' });
    await expect(generateMetadata({ params })).resolves.toEqual({ title: 'test' });
  });

  it('returns variable name as title for authenticated user with DRAFT variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: true });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({ ...baseVariable, variable_status: 'DRAFT' });
    await expect(generateMetadata({ params })).resolves.toEqual({ title: baseVariable.name });
  });

  it('returns variable name as title for unauthenticated user with PUBLISHED_EXTERNAL variable', async () => {
    vi.mocked(authenticateUser).mockResolvedValue({ isAuthenticated: false });
    vi.mocked(getRenderedVariableDefinition).mockResolvedValue({
      ...baseVariable,
      variable_status: 'PUBLISHED_EXTERNAL',
    });
    await expect(generateMetadata({ params })).resolves.toEqual({ title: baseVariable.name });
  });
});
