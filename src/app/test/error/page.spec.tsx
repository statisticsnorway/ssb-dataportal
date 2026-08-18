import { beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './page';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
}));

describe('error test page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('throws the preview error when test routes are enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_TEST_ROUTES', 'true');

    await expect(Page()).rejects.toThrow('E2E_TEST_ERROR');
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it('renders not-found when test routes are disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_TEST_ROUTES', 'false');
    mocks.notFound.mockImplementation(() => {
      throw new Error('NEXT_NOT_FOUND');
    });

    await expect(Page()).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledOnce();
  });
});
