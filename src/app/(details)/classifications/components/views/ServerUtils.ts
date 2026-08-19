'use server';

import { cookies, headers } from 'next/headers';
import { languageCookieName, resolveLanguage } from '@/libs/language';

export async function getRequestLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  return resolveLanguage(
    cookieStore.get(languageCookieName)?.value,
    requestHeaders.get('accept-language') ?? undefined,
  );
}
