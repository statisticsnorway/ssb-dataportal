import { useCallback, useState } from 'react';
import { clientLogger } from '@/libs/logger/client-logger';
import { sanitizeError } from '@/libs/logger/sanitize';

export function useClipboard(timeout = 2500) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch (err) {
        clientLogger.warn({ error: sanitizeError(err) }, 'Clipboard copy failed');
      }
    },
    [timeout],
  );
  return { copied, copyToClipboard };
}
