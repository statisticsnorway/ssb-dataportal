'use client';

import { Details, DetailsContent, DetailsSummary } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';

import styles from './clientDetails.module.css';

interface ClientDetailsProps {
  summary: string;
  content: string;
}

/**
 * This component handles 'Details' component only mounts on client
 * so it can be rendered in a server component.
 */
const ClientDetails = ({ summary, content }: ClientDetailsProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Details>
      <DetailsSummary className={`${styles.summaryDetail} font-roboto`}>{summary}</DetailsSummary>
      <DetailsContent className={styles.contentDetail}>{content}</DetailsContent>
    </Details>
  );
};

export { ClientDetails };
