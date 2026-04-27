'use client';

import { Card, Details, DetailsContent, DetailsSummary, Heading, Paragraph } from '@digdir/designsystemet-react';
import { notFound } from 'next/navigation';
import { tabsData } from '@/app/(services)/tabs';
import { useAuthContext } from '@/app/authContext';
import { DetailsTable } from '@/components/details-table';
import { ExternalLink } from '@/components/link-components/externalLink';
import { ShortNameTag } from '@/components/tag-components/short-name-tag';
import { StatusTag } from '@/components/tag-components/statusTag';
import { VardefBreadcrumbs } from '@/components/vardef-breadcrumbs';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { getHomeBreadcrumb } from '@/utils/breadcrumbs';
import { isVariablePubliclyAccessible } from '@/utils/variableAccess';
import { CodeSnippet } from './components/codeSnippet';
import { mapAboutVariableItems, mapContactItems } from './groups';
import styles from './variable-details-page.module.css';

export default function VariableDefinitionDetail({
  variableDefinition,
  apiDocsBaseUrl,
  daplaLabVardefUrl,
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
        <Heading className={styles.detailsHeading} data-size='2xl' level={1}>
          {variableDefinition.name}
        </Heading>
        <ShortNameTag shortName={variableDefinition.short_name} />
        <Paragraph className={`${styles.definition} ingress`}>{variableDefinition.definition}</Paragraph>
        {isAuthenticated && <StatusTag variableStatus={variableDefinition.variable_status} />}
        {variableDefinition.comment ? (
          <Card>
            <Details>
              <DetailsSummary data-size='lg' className={`font-roboto`}>
                {localization.variableDefinition.comment}
              </DetailsSummary>
              <DetailsContent>{variableDefinition.comment}</DetailsContent>
            </Details>
          </Card>
        ) : null}
        <DetailsTable
          title={localization.variableDefinition.aboutVariable}
          content={mapAboutVariableItems(variableDefinition, isAuthenticated, apiDocsBaseUrl)}
        />
        {isAuthenticated && (
          <div className={styles.codeSnippet}>
            <CodeSnippet
              daplaLabVardefUrl={daplaLabVardefUrl}
              //TODO(jan): Should replace <div className={styles.codeSnippetTitle}> with correct semantic element (header?)
              title={
                <div className={styles.codeSnippetTitle}>
                  <span className={styles.titleMain}>
                    <img src='/python-logo-only.svg' alt='' className={styles.pythonIcon} />{' '}
                    {localization.variableDefinition.fetchWith}
                  </span>
                  <ExternalLink
                    className={styles.titleLink}
                    href='https://pypi.org/project/dapla-toolbelt-metadata/'
                    linkText='dapla-toolbelt-metadata (pypi.org)'
                  />
                </div>
              }
              code={[
                `Vardef.get_variable_definition_by_shortname(`,
                `    short_name="${variableDefinition.short_name}"`,
                `)`,
              ]}
            />
          </div>
        )}
        <DetailsTable
          title={localization.variableDefinition.contact}
          content={mapContactItems(variableDefinition, isAuthenticated)}
        />
      </main>
    </div>
  );
}
