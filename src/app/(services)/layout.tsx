'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ServicesLayout({ children, search }: { children: ReactNode; search: ReactNode }) {
  const pathname = usePathname();

  // Check if we're on a detail page (has an ID in the path)
  const isDetailPage =
    /\/variable-definitions\/[^/]+$/.test(pathname) ||
    /\/classifications\/[^/]+$/.test(pathname) ||
    /\/datasets\/[^/]+$/.test(pathname);

  // On detail pages, only show children (detail page)
  // On list pages, only show listing (search page with tabs)
  return <>{isDetailPage ? children : search}</>;
}
