import { getAuthorizationHeader, getJwt } from './jwt';

const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({ get: () => `Bearer ${JWT}` }),
}));

describe('jwt functions', () => {
  it('getAuthorizationHeader', () => {
    expect(getAuthorizationHeader()).resolves.toEqual(`Bearer ${JWT}`);
  });
  it('getJwt', () => {
    expect(getJwt()).resolves.toEqual(JWT);
  });
});
