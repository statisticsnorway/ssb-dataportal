'use client';

import { initializeFaro } from '@grafana/faro-web-sdk';
import { useEffect } from 'react';

export function FaroInit() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_FARO_COLLECTOR_URL;
    if (url) {
      initializeFaro({ url, app: { name: 'dataportalen' } });
    }
  }, []);

  return null;
}
