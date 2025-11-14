'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VariableDefinition() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    router.replace(`/variable-definitions/${id}`);
  }, [id, router]);

  return <div>Loading...</div>;
}
