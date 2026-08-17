import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildUrl } from '../../../utils/urls';

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
  logger: {
    info: vi.fn(),
  },
  createLogger: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));

vi.mock('@/libs/logger/server-logger', () => ({
  createLogger: mocks.createLogger,
}));

describe('ClassificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createLogger.mockReturnValue(mocks.logger);
  });

  it('logs and redirects to codes page', async () => {
    const { default: ClassificationPage } = await import('./page');

    await expect(
      ClassificationPage({
        params: Promise.resolve({ id: '123', versionNumber: '42' }),
      }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mocks.createLogger).toHaveBeenCalledWith('classification-details-page');
    expect(mocks.logger.info).toHaveBeenCalledWith(
      { id: '123', versionNumber: '42' },
      'Classification detail version page access',
    );
    expect(mocks.redirect).toHaveBeenCalledWith(buildUrl({ classificationId: 123, versionId: 42, tab: 'codes' }));
  });
});
