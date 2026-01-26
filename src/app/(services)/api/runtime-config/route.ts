import { NextResponse } from 'next/server';

const PUBLIC_ENV_MAP = {
  daplaLabVardefUrl: 'DAPLA_LAB_VARDEF_URL',
} as const;

type PublicRuntimeConfig = {
  [K in keyof typeof PUBLIC_ENV_MAP]: string;
};

function loadPublicConfig(): PublicRuntimeConfig {
  const cfg = {} as Record<string, string>;
  for (const [publicKey, envKey] of Object.entries(PUBLIC_ENV_MAP)) {
    const value = process.env[envKey as keyof NodeJS.ProcessEnv];
    if (!value) {
      console.error(`[runtime-config] ${envKey} er ikke satt`);
      throw new Error('Konfig mangler');
    }
    cfg[publicKey] = value;
  }
  return cfg as PublicRuntimeConfig;
}

export async function GET() {
  try {
    const config = loadPublicConfig();
    const res = NextResponse.json(config);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch {
    return NextResponse.json(
      { error: 'Runtime-konfig ikke tilgjengelig.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
