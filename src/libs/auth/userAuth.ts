import 'server-only';

import { JWTPayload } from 'jose';
import { Auth } from '@/types/auth';
import { createLogger } from '../logger/server-logger';
import { getEncodedJwt, verifyJwt } from './jwt';

const logger = createLogger('user-auth');

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
  logger.info('User authenticated');
  return mapJwtPayloadToAuth(payload);
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
  return { isAuthenticated: payload != undefined };
}
