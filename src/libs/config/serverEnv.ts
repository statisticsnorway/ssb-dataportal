const PUBLIC_ENV_MAP = {
  daplaLabVardefUrl: 'DAPLA_LAB_VARDEF_URL',
} as const;

export type PublicRuntimeConfig = {
  [K in keyof typeof PUBLIC_ENV_MAP]: string;
};

export function getPublicRuntimeConfig(): PublicRuntimeConfig {
  const cfg = {} as Record<string, string>;
  for (const [publicKey, envKey] of Object.entries(PUBLIC_ENV_MAP)) {
    const value = process.env[envKey as keyof NodeJS.ProcessEnv];
    if (!value) {
      console.error(`[runtime-config] ${envKey} not set`);
      throw new Error('Missing config');
    }
    cfg[publicKey] = value;
  }
  return cfg as PublicRuntimeConfig;
}
