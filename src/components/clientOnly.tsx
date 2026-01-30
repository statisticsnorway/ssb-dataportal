'use client';

import { Details, DetailsContent, DetailsSummary } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';

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
    <Details style={{ marginBottom: '1rem' }}>
      <DetailsSummary>{summary}</DetailsSummary>
      <DetailsContent>{content}</DetailsContent>
    </Details>
  );
}
