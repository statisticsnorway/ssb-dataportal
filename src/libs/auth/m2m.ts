'use server';

import { getUserAgent } from '@/utils/userAgent';
import { sanitizeError } from '../logger/sanitize';
import { createLogger } from '../logger/server-logger';

const ttlSeconds = Number(process.env.M2M_TOKEN_TTL_SECONDS);

export async function getM2mToken(clientId: string | undefined, clientSecret: string | undefined) {
  const logger = createLogger('m2m-token');
  logger.debug(`Fetching M2M token from Keycloak for client ${clientId}`);
  try {
    const keycloakHost = process.env.KEYCLOAK_HOST;
    if (!keycloakHost || !clientId || !clientSecret) {
      throw new Error('Necessary data not provided');
    }

    let response = await fetch(keycloakHost + '/realms/ssb/protocol/openid-connect/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      headers: {
        'User-Agent': getUserAgent(),
      },
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    });
    if (!response.ok) {
      throw new Error(`M2M token request failed: ${response.status} ${await response.text()}`);
    }
    logger.debug({ statusCode: response.status, url: response.url }, 'Response from Keycloak');
    let json = await response.json();
    return json['access_token'];
  } catch (error: unknown) {
    logger.error({ error: sanitizeError(error) }, 'Unexpected error during fetch');
    throw error;
  }
}
