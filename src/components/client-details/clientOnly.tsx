'use client';

import { Details, DetailsContent, DetailsSummary } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';

import styles from './clientOnly.module.css';

interface ClientOnlyDetailsProps {
  summary: string;
  content: string;
}

export default function ClientOnlyDetails({ summary, content }: ClientOnlyDetailsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Details className={styles.customDetails}>
      <DetailsSummary className={styles.summaryDetail}>{summary}</DetailsSummary>
      <DetailsContent className={styles.contentDetail}>{content}</DetailsContent>
    </Details>
  );
}
