'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Classification() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    router.replace(`/classifications/${id}`);
  }, [id, router]);

  return <div>Loading...</div>;
}
