import { Heading, Label, Tag } from '@digdir/designsystemet-react';
import React from 'react';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPagePanel } from '@/components/details-page-panel/details-page-panel';
import { TextField } from '@/components/text-field/text-field';
import { ownerItems, personalData, referencesItems, validityItems } from '@/utils/groups';
import { testVardefData } from '@/utils/mock-data';
import styles from './variable-details-page.module.css';

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
      <header className={styles.detailsPageHeader}>
        <Heading level={1} data-size='lg'>
          {variableDefinition.name.nb}
        </Heading>
        <Label className={styles.infoText}>
          {variableDefinition.shortName}
          <div className={styles.separator} />
          ID: {variableDefinition.id}
        </Label>
      </header>
      <main className={styles.contentGrid}>
        <article className={styles.mainColumn}>
          <section className={styles.section}>
            <TextField label='Definisjon' value={variableDefinition.definition.nb ?? ''} longText />
            {variableDefinition.comment?.nb && <TextField label='Kommentar' value={variableDefinition.comment.nb} />}
          </section>
          <DetailsPagePanel title='Eier' elements={ownerItems(variableDefinition)} columns={2} />
          <DetailsPagePanel title='Gyldighet' elements={validityItems(variableDefinition)} columns={2} />
        </article>
        <aside className={styles.sidebar}>
          <Tag data-size='md' data-color='info'>
            {variableDefinition.variableStatus}
          </Tag>
          <DetailsPagePanel title='Referanser' elements={referencesItems(variableDefinition)} />
          <DetailsPagePanel title='Personopplysninger' elements={personalData(variableDefinition)} />
        </aside>
      </main>
    </section>
  );
}
