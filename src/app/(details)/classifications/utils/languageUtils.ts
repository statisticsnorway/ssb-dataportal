import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { languageCookieName, resolveLanguage } from '@/libs/language';

async function getRequestLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  return resolveLanguage(
    cookieStore.get(languageCookieName)?.value,
    requestHeaders.get('accept-language') ?? undefined,
  );
}

export const getRequestLanguageCached = cache(getRequestLanguage);
