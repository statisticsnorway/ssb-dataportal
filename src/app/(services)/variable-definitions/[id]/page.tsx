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

  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: 'Variabeldefinisjoner', href: '/variable-definitions' };
  const breadcrumbList = id ? ([{ text: variableDefinition.name, href: '' }] as BreadcrumbType[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <Breadcrumbs breadcrumbList={breadcrumbList} homeUrl={homeUrl} />
      <header className={styles.detailsPageHeader}>
        <Heading level={1} data-size='lg'>
          {variableDefinition.name}
        </Heading>
        <Label className={styles.infoText}>
          {variableDefinition.shortName}
          <div className={styles.separator} />
          ID: {variableDefinition.id}
        </Label>
      </header>
      <div className={styles.contentGrid}>
        <article className={styles.mainColumn}>
          <section className={styles.mainSection}>
            <dl>
              <TextField label='Definisjon' value={variableDefinition.definition ?? ''} longText />
              {variableDefinition.comment && (
                <TextField label='Kommentar' value={variableDefinition.comment} longText />
              )}
            </dl>
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
      </div>
    </section>
  );
}
