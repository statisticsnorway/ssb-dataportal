import { describe, expect, it, vi } from 'vitest';
import { getAuthorizationHeader, getEncodedJwt } from './jwt';

const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({ get: () => `Bearer ${JWT}` }),
}));

describe('jwt functions', () => {
  it('getAuthorizationHeader', () => {
    expect(getAuthorizationHeader()).resolves.toEqual(`Bearer ${JWT}`);
  });
  it('getEncodedJwt', () => {
    expect(getEncodedJwt()).resolves.toEqual(JWT);
  });
});
