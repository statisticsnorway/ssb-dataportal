'use client';

import { Heading } from '@digdir/designsystemet-react';
import { useParams } from 'next/navigation';
import { BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPageLayout } from '@/components/details-page-layout';

export default function VariableDefinition() {
  const params = useParams();
  const id = params.id;

  console.log({ id });

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
