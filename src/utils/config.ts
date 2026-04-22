export function getVardefApiDocsUrl(): string {
  return process.env.VARDEF_API_DOCS_URL ?? 'https://metadata.ssb.no/docs/swagger/variable-definitions';
}

export function buildVardefApiDocsUrl(isAuthenticated: boolean): string {
  const base = getVardefApiDocsUrl();

  return isAuthenticated ? `${base}?urls.primaryName=internal` : base;
}
