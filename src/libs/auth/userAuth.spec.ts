import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyJwt } from './jwt';
import { authenticateUser } from './userAuth';

vi.mock('server-only', () => ({}));

vi.mock('./jwt');

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

describe('authenticateUser', async () => {
  describe('auth disabled', async () => {
    it('is authenticated', async () => {
      process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'true';
      process.env.IS_AUTHENTICATED = 'true';
      await expect(authenticateUser()).resolves.toEqual({ isAuthenticated: true });
    });
    it('app deployed', async () => {
      process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'true';
      process.env.NAIS_CLUSTER_NAME = 'prod';
      process.env.IS_AUTHENTICATED = 'true';
      await expect(authenticateUser()).rejects.toThrow('User auth is disabled in deployed in environment!');
    });
  });
  describe('auth enabled', async () => {
    it('missing env vars', async () => {
      process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'false';
      await expect(authenticateUser()).rejects.toThrow('Necessary environment variable not set');
    });
    it('unsuccessful auth', async () => {
      process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'false';
      process.env.KEYCLOAK_HOST = 'https://www.example.com';
      process.env.KEYCLOAK_JWKS_PATH = '/jwks/path';
      process.env.KEYCLOAK_ISSUER_PATH = '/issuer/path';
      vi.mocked(verifyJwt).mockResolvedValue(undefined);
      await expect(authenticateUser()).resolves.toEqual({ isAuthenticated: false });
    });
    it('successful auth', async () => {
      process.env.DANGEROUSLY_DISABLE_USER_AUTH = 'false';
      process.env.KEYCLOAK_HOST = 'https://www.example.com';
      process.env.KEYCLOAK_JWKS_PATH = '/jwks/path';
      process.env.KEYCLOAK_ISSUER_PATH = '/issuer/path';
      vi.mocked(verifyJwt).mockResolvedValue({ email: 'kno@ssb.no' });
      await expect(authenticateUser()).resolves.toEqual({
        isAuthenticated: true,
        user: {
          dapla: undefined,
          email: 'kno@ssb.no',
          family_name: undefined,
          given_name: undefined,
          name: undefined,
          preferred_username: undefined,
          section_code: undefined,
          section_name: undefined,
        },
      });
    });
  });
});
