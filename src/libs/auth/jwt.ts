import { headers } from 'next/headers';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose'
import { createLogger } from '../logger/server-logger';
import { sanitizeError } from '../logger/sanitize';

const logger = createLogger('jwt');

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

export async function verifyJwt(jwksUri: string, encodedJwt: string | undefined, expectedIssuer: string | undefined, expectedAudience: string | undefined): Promise<JWTPayload | undefined> {
  if (!encodedJwt) return undefined
  const JWKS = createRemoteJWKSet(new URL(jwksUri))
  try {
    const { payload } = await jwtVerify(encodedJwt, JWKS, {
      issuer: expectedIssuer,
      audience: expectedAudience,
      algorithms: ['RS256'],
    })
    // If the jwtVerify function doesn't throw an error then the JWT is valid
    return payload
  } catch (e) {
    logger.error({ error: sanitizeError(e) }, "Invalid JWT")
    return undefined
  }
}
