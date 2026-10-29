import { useSyncExternalStore } from 'react';

const phoneQuery = () => window.matchMedia?.('(max-width: 719px)');

const subscribe = (onChange: () => void) => {
  const mediaQueryList = phoneQuery();
  mediaQueryList?.addEventListener('change', onChange);
  return () => mediaQueryList?.removeEventListener('change', onChange);
};

/**
 * Whether the viewport is phone sized (up to 719px wide). Always `false` during server rendering.
 */
export const useIsPhone = () =>
  useSyncExternalStore(
    subscribe,
    () => !!phoneQuery()?.matches,
    () => false,
  );
