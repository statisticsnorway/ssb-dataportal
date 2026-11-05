import { useEffect, useRef, useState } from 'react';
import { clientLogger } from '@/libs/logger/client-logger';

/**
 * Loads data for `key` after a debounce. Nothing is loaded while `key` is null. `value` is undefined until the result
 * for the current key has arrived, and is `fallback` if loading failed.
 */
export function useDebouncedLoad<T>(key: string | null, load: () => Promise<T>, fallback: T, delayMs = 250) {
  const [result, setResult] = useState<{ key: string; value: T } | null>(null);
  const latest = useRef({ load, fallback });
  latest.current = { load, fallback };

  useEffect(() => {
    if (key === null) return;

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      latest.current
        .load()
        .catch((error: unknown) => {
          clientLogger.error({ error }, 'Failed to load dataset filter data');
          return latest.current.fallback;
        })
        .then((value) => {
          if (!cancelled) setResult({ key, value });
        });
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [key, delayMs]);

  const isCurrent = key !== null && result?.key === key;
  return { value: isCurrent ? result.value : undefined, isLoading: key !== null && !isCurrent };
}
