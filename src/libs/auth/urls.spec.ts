import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLoginUrl, getLogoutUrl } from './urls';

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
describe('redirects', async () => {
  it('to', async () => {
    process.env.NEXT_PUBLIC_LOGIN_URL = '/oauth2/login';
    expect(getLoginUrl('/variable-definitions')).toEqual('/oauth2/login?redirect=/variable-definitions');
  });

  it('to /', async () => {
    process.env.NEXT_PUBLIC_LOGOUT_URL = '/oauth2/logout';
    expect(getLogoutUrl('/')).toEqual('/oauth2/logout?redirect=/');
  });
  it('throw error', async () => {
    process.env.NEXT_PUBLIC_LOGOUT_URL = '';
    expect(() => getLogoutUrl('/')).toThrow('Missing LOGOUT URL');
  });
});
