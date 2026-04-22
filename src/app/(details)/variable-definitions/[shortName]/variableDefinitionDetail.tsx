'use client';

import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DetailsTable } from '@/components/details-table';
import { VardefBreadcrumbs } from '@/components/vardef-breadcrumbs';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { isVariablePubliclyAccessible } from '@/utils/variableAccess';
import { mapAboutVariableItems, mapContactItems } from './groups';
import styles from './variable-details-page.module.css';

export default function VariableDefinitionDetail({
  variableDefinition,
  apiDocsBaseUrl,
}: Readonly<{
  variableDefinition: RenderedView;
  daplaLabVardefUrl: string | undefined;
  apiDocsBaseUrl: string;
}>) {
  const { isAuthenticated } = useAuthContext();

  if (!isVariablePubliclyAccessible(variableDefinition.variable_status, isAuthenticated)) {
    notFound();
  }

  return (
    <div className={`${styles.detailsPage} container`}>
      <VardefBreadcrumbs
        homeUrl={getHomeBreadcrumb()}
        items={[{ text: localization.variableDefinition.labelPlural, href: tabsData.VariableDefinitions.route }]}
        currentText={variableDefinition.short_name}
      />
      <main className={styles.mainContent}>
        <Heading className='heading12' level={1} data-size='xl'>
          {variableDefinition.name}
        </Heading>
        <Paragraph className={`${styles.definition} ingress`}>{variableDefinition.definition}</Paragraph>
        <DetailsTable
          title={localization.variableDefinition.aboutVariable}
          content={mapAboutVariableItems(variableDefinition, isAuthenticated, apiDocsBaseUrl)}
        />
        <DetailsTable
          title={localization.variableDefinition.contact}
          content={mapContactItems(variableDefinition, isAuthenticated)}
        />
      </main>
    </div>
  );
}
