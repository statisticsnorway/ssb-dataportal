import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatPeriodString } from './dates';

beforeEach(() => {
  vi.stubEnv('TZ', 'UTC');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('formatPeriodString', () => {
  it("dates aren't shifted due to timezone mismatch", () => {
    expect(
      formatPeriodString({
        contains_data_from: new Date('1998-01-01T00:00:00'),
        contains_data_until: new Date('2025-12-31T23:59:59'),
      }),
    ).toEqual('jan. 1998 - des. 2025');
  });
});
