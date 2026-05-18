export function getVardefApiDocsUrl(): string {
  return process.env.VARDEF_API_DOCS_URL ?? 'https://metadata.ssb.no/docs/swagger/variable-definitions';
}
export function getDaplaCtrlUrl(): string {
  return process.env.DAPLA_CTRL_URL ?? 'https://dapla-ctrl.intern.ssb.no';
}
