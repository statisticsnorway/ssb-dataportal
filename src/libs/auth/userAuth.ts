import 'server-only';

import { JWTPayload } from 'jose';
import { Auth } from '@/types/auth';
import { createLogger } from '../logger/server-logger';
import { getEncodedJwt, verifyJwt } from './jwt';

const logger = createLogger('user-auth');

/**
 * Authenticate a user.
 *
 * The only supported method is that a JWT Bearer token is
 * supplied with each request. This is verified against an
 * SSB Keycloak instance.
 *
 * For local development this may be disabled and full
 * control taken over authentication data by using the
 * appropriate environment variables.
 *
 * @returns the Auth object which indicates whether the user
 *  is logged in and information about the user if they are.
 */
export async function authenticateUser(): Promise<Auth> {
  if (process.env.DANGEROUSLY_DISABLE_USER_AUTH === 'true') {
    return createLocalDevAuth();
  }
  return authenticateWithKeycloakJwt();
}

async function authenticateWithKeycloakJwt(): Promise<Auth> {
  const payload = await verifyJwt(
    getKeycloakJwksUri(),
    await getEncodedJwt(),
    getExpectedIssuer(),
    process.env.USER_AUTH_TOKEN_EXPECTED_AUDIENCE,
  );
  if (!payload) {
    logger.info('User not authenticated');
    return { isAuthenticated: false };
  }
  const auth = mapJwtPayloadToAuth(payload);
  logger.info({ user: auth.user?.preferred_username }, 'User authenticated');
  return auth;
}

function getKeycloakJwksUri(): string {
  const keycloakHost = process.env.KEYCLOAK_HOST;
  const keycloakJwksPath = process.env.KEYCLOAK_JWKS_PATH;
  if (!keycloakHost || !keycloakJwksPath) {
    throw new Error('Necessary environment variable not set');
  }
  logger.debug(`Using JWKS from ${keycloakHost + keycloakJwksPath}`);
  return keycloakHost + keycloakJwksPath;
}

function getExpectedIssuer(): string {
  const keycloakHost = process.env.KEYCLOAK_HOST;
  const keycloakIssuerPath = process.env.KEYCLOAK_ISSUER_PATH;
  if (!keycloakHost || !keycloakIssuerPath) {
    throw new Error('Necessary environment variable not set');
  }
  return keycloakHost + keycloakIssuerPath;
}

function createLocalDevAuth(): Auth {
  if (process.env.NAIS_CLUSTER_NAME != undefined) throw Error('User auth is disabled in deployed in environment!');
  logger.warn(
    'Danger! User auth is disabled. This may allow unauthenticated users access. This message should only be visible in local dev environments.',
  );
  return { isAuthenticated: process.env.IS_AUTHENTICATED === 'true' };
}

function mapJwtPayloadToAuth(payload: JWTPayload): Auth {
  if (!payload) return { isAuthenticated: false };
  const dapla = payload['dapla'] as Record<string, unknown>;
  return {
    isAuthenticated: true,
    user: {
      name: payload['name'] as string,
      preferred_username: payload['preferred_username'] as string,
      given_name: payload['given_name'] as string,
      family_name: payload['family_name'] as string,
      email: payload['email'] as string,
      section_name: dapla['section_name'] as string,
      section_code: dapla['section_code'] as string,
      dapla: { teams: dapla['teams'] as string[], groups: dapla['groups'] as string[] },
    },
  };
}
