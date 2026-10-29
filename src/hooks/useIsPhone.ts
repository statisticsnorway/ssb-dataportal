import { useSyncExternalStore } from 'react';

const PHONE_MEDIA_QUERY = '(max-width: 719px)';

const noop = () => undefined;

const subscribe = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return noop;
  const mediaQueryList = window.matchMedia(PHONE_MEDIA_QUERY);
  mediaQueryList.addEventListener('change', onChange);
  return () => mediaQueryList.removeEventListener('change', onChange);
};

const getSnapshot = () => typeof window !== 'undefined' && !!window.matchMedia?.(PHONE_MEDIA_QUERY).matches;

const getServerSnapshot = () => false;

/**
 * Whether the viewport is phone sized (up to 719px wide). Always `false` during server rendering.
 */
export const useIsPhone = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
