'use client';

import { BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPageLayout } from '@/components/details-page-layout';
import { Heading } from '@digdir/designsystemet-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Classification() {
  const params = useParams();
  const id = params.id;

  console.log({ id });
  const [loading, setLoading] = useState(true);
  const [classification, setClassification] = useState<string>('');
  const [error, setError] = useState(null);

  console.log(error);
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);

        setClassification('data');
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!classification) return <div>Classification not found</div>;

  const homeUrl = { text: 'Klassifikasjoner', href: '/classifications' };
  const breadcrumbList = id ? ([{ text: String(id), href: '' }] as BreadcrumbType[]) : [];
  return (
    <DetailsPageLayout
      title={String(id)}
      mainContent={<Heading level={3}>Hallo Klassifikasjon</Heading>}
      breadcrumbList={breadcrumbList}
      homeUrl={homeUrl}
    ></DetailsPageLayout>
  );
}
