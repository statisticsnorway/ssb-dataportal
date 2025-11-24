'use client';

import { Heading } from '@digdir/designsystemet-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPageLayout } from '@/components/details-page-layout';


export default function VariableDefinition() {
  const params = useParams();
  const id = params.id;

  console.log({ id });
  const [loading, setLoading] = useState(true);
  const [variableDefinition, setVariableDefinition] = useState<string>('');
  const [error, setError] = useState(null);

  console.log(error);
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);

        setVariableDefinition('data');
        // biome-ignore lint/suspicious/noExplicitAny: <ignore for now>
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!variableDefinition) return <div>Variabeldefinisjon ikke funnet</div>;

  const homeUrl = { text: 'Variabeldefinisjoner', href: '/variable-definitions' };
  const breadcrumbList = id ? ([{ text: String(id), href: '' }] as BreadcrumbType[]) : [];
  return (
    <DetailsPageLayout
      title={String(id)}
      mainContent={<Heading level={3}>Hallo Variabel</Heading>}
      breadcrumbList={breadcrumbList}
      homeUrl={homeUrl}
    ></DetailsPageLayout>
  );
}
