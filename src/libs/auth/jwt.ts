import { headers } from 'next/headers';

/**
 * Get the Authorization header from the request.
 */
export async function getAuthorizationHeader(): Promise<string | null> {
  return (await headers()).get('authorization');
}

/**
 * Get the Base64 encoded JWT from the Authorization header on the request.
 */
export async function getJwt(): Promise<string | undefined> {
  return (await getAuthorizationHeader())?.split(' ')[1];
}
