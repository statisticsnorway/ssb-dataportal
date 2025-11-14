export const parsePreferredLanguage = (headerValue: string): string => {
  if (!headerValue) return 'nb';
  const languages = headerValue
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase())
    .map((lang) => lang.slice(0, 2));

  for (const lang of languages) {
    return lang;
  }

  return 'nb';
};
