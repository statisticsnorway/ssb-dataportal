import 'server-only';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { languageCookieName, resolveLanguage, type SupportedLanguage } from './localization';
import { logLanguageResolution } from './logLanguageResolution';

const getCachedRequestLanguage = cache(async (): Promise<SupportedLanguage> => {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const cookieLanguage = cookieStore.get(languageCookieName)?.value;
  const acceptLanguage = requestHeaders.get('accept-language') ?? undefined;
  const language = resolveLanguage(cookieLanguage, acceptLanguage);

  if (!cookieLanguage) {
    logLanguageResolution(cookieLanguage, acceptLanguage, language);
  }

  return language;
});

export async function getRequestLanguage(): Promise<SupportedLanguage> {
  return getCachedRequestLanguage();
}
