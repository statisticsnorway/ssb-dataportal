import 'server-only';

import * as jose from 'jose';
import { headers } from 'next/headers';
import { sanitizeError } from '../logger/sanitize';
import { createLogger } from '../logger/server-logger';

/**
 * Get the Authorization header from the request.
 */
export async function getAuthorizationHeader(): Promise<string | null> {
  return (await headers()).get('authorization');
}

/**
 * Get the Base64 encoded JWT from the Authorization header on the request.
 */
export async function getEncodedJwt(): Promise<string | undefined> {
  return (await getAuthorizationHeader())?.split(' ')[1];
}

export async function verifyJwt(
  jwksUri: string,
  encodedJwt: string | undefined,
  expectedIssuer: string | undefined,
  expectedAudience: string | undefined,
): Promise<jose.JWTPayload | undefined> {
  const logger = createLogger('jwt');
  if (!encodedJwt) {
    logger.info('No JWT to verify.');
    return undefined;
  }
  const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));
  try {
    const { payload } = await jose.jwtVerify(encodedJwt, JWKS, {
      issuer: expectedIssuer,
      audience: expectedAudience,
      algorithms: ['RS256'],
    });
    // If the jwtVerify function doesn't throw an error then the JWT is valid
    return payload;
  } catch (e) {
    logger.error({ error: sanitizeError(e) }, 'JWT failed verification.');
    return undefined;
  }
}
