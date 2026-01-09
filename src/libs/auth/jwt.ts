import { headers } from 'next/headers';

/**
 * Get the Authorization header from the request.
 */
export async function getAuthorizationHeader(): Promise<string | null> {
  const allHeaders = await headers();
  allHeaders.entries().forEach((header) => console.debug(header));
  return allHeaders.get('authorization');
}

/**
 * Get the Base64 encoded JWT from the Authorization header on the request.
 */
export async function getEncodedJwt(): Promise<string | undefined> {
  return (await getAuthorizationHeader())?.split(' ')[1];
}
