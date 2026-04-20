export function getVardefApiDocsUrl(): string {
  return process.env.VARDEF_API_DOCS_URL ?? 'https://metadata.ssb.no/docs/swagger/variable-definitions';
}
