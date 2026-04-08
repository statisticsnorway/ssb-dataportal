import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { authenticateUser } from './userAuth';

vi.mock('server-only', () => ({}));

const ORIGINAL_ENV = process.env;
beforeEach(() => {
  // Allow independently modifying process.env in tests
  // by resetting it before each
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterAll(() => {
  process.env = ORIGINAL_ENV; // Restore old environment
});

describe('userAuth functions', async () => {
  it('authenticateUser auth disabled', async () => {
    process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'true';
    process.env.IS_AUTHENTICATED = 'true';
    expect(authenticateUser()).toEqual({ isAuthenticated: true });
  });
  it('authenticateUser auth disabled and app deployed', async () => {
    process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'true';
    process.env.NAIS_CLUSTER_NAME = 'prod';
    process.env.IS_AUTHENTICATED = 'true';
    expect(authenticateUser).toThrow('User auth is disabled in deployed in environment!');
  });
});
