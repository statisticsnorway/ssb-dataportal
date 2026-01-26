'use client';
import { useEffect, useState } from 'react';

export type RuntimeConfig = {
  daplaLabVardefUrl: string;
};

export function useRuntimeConfig() {
  const [cfg, setCfg] = useState<RuntimeConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    fetch('/api/runtime-config', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Feil ${r.status}`);
        }
        return r.json();
      })
      .then((json) => on && setCfg(json))
      .catch((e) => on && setError(String(e)));
    return () => {
      on = false;
    };
  }, []);
  return { cfg, error, loading: !cfg && !error };
}
