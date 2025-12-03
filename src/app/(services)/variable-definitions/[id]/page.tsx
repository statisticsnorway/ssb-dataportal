import React from 'react';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { testVardefData } from '@/utils/mock-data';
import { DetailsPageHeader } from './details-page-header';
import styles from './variable-details-page.module.css';
import { validityItems, referencesItems, ownerItems, personalData } from '@/utils/groups';
import { DetailsPagePanel } from '@/components/details-page-panel/details-page-panel';
import { TextField } from '@/components/text-field/text-field';

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
    <section className={`${styles.detailsPage} container`}>
      <Breadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />
      <DetailsPageHeader variableDefinition={variableDefinition} />
      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
    <section className={styles.section}>
      <TextField label='Definisjon' value={variableDefinition.definition.nb ?? ''} />
      {variableDefinition.comment?.nb && <TextField label='Kommentar' value={variableDefinition.comment.nb} />}
    </section>
          <DetailsPagePanel title="Ownership" elements={ownerItems(variableDefinition)} columns={2} />
          <DetailsPagePanel title="Validity" elements={validityItems(variableDefinition)} columns={2} />
        </div>
        <aside className={styles.sidebar}>
          <DetailsPagePanel title="References" elements={referencesItems(variableDefinition)} />
          <DetailsPagePanel title="Personopplysninger" elements={personalData(variableDefinition)} />
        </aside>
      </div>
    </section>
  );
}
