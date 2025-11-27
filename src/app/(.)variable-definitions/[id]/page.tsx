import React from 'react';
import { BreadcrumbType } from '@/components/breadcrumbs';
import { VariableDetailsPageLayout } from "@/components/variable-details-page"
import { testVardefData } from '@/utils/mock-data';
import { CoreInformation } from '@/components/variable-details/core-information';
import { ValidityAndStatus } from '@/components/variable-details/validity-and-status';
import { Ownership } from '@/components/variable-details/ownership';

import { References } from '@/components/variable-details/references';

export default function VariableDefinition({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const variableDefinition = testVardefData.variableDefinitions.find((v) => v.id === id);

  console.log(variableDefinition);

  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: 'Variabeldefinisjoner', href: '/variable-definitions' };
  const breadcrumbList = id ? ([{ text: String(id), href: '' }] as BreadcrumbType[]) : [];

  return (
    <VariableDetailsPageLayout
      variableDefinition={variableDefinition}
      breadcrumbList={breadcrumbList}
      homeUrl={homeUrl}
      mainContent={
        <>
          <CoreInformation data={variableDefinition} />
          <Ownership data={variableDefinition} />
          <ValidityAndStatus data={variableDefinition} />
        </>
      }
      asideContent={<References data={variableDefinition} />}
    />
  );
}
