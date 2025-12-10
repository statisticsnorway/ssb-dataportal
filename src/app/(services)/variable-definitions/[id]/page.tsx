import { Label, Tag } from '@digdir/designsystemet-react';
import React from 'react';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPagePanel } from '@/components/details-page-panel/details-page-panel';
import { TextField } from '@/components/text-field/text-field';
import { testVardefData } from '@/utils/mock-data';
import { VardefHeading } from '../components/vardefHeading';
import styles from './variable-details-page.module.css';
import { contactItems, validityItems, ownerItems, referencesItems, createdAndEditedItems, unitTypesItems, personalDataItems } from './groups';

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
        <VardefHeading
          headingProps={{ 'data-size': 'lg', level: 1 }}
          variableDefinition={variableDefinition}
        ></VardefHeading>
        <div className={styles.statusRow}>
          <Label className={styles.infoText}>ID: {variableDefinition.id}</Label>
          <Tag className={styles.variableStatusTag} data-size='lg' data-color='info'>
            {variableDefinition.variableStatus}
          </Tag>
        </div>
      </header>
      <div className={styles.contentGrid}>
        <article className={styles.mainColumn}>
          <section className={styles.mainSection}>
            <div className={styles.coreInformation}>
              <h2 className={styles.definitionTitle}>Definisjon</h2>
              <p className={styles.definition}>{variableDefinition.definition}</p>
              {variableDefinition.comment && (
                <TextField label='Kommentar' value={variableDefinition.comment} />
              )}
            </div>
          </section>
          <DetailsPagePanel title='Kontakt' elements={contactItems(variableDefinition)} columns={2} />
          <DetailsPagePanel title='Personopplysninger' elements={personalDataItems(variableDefinition)} />
          <DetailsPagePanel title='Eier' elements={ownerItems(variableDefinition)} columns={2} />
        </article>
        <aside className={styles.sidebar}>
          <DetailsPagePanel title='Enhetstyper og statistikkområder' elements={unitTypesItems(variableDefinition)} />
          <DetailsPagePanel title='Referanser' elements={referencesItems(variableDefinition)} />
          <DetailsPagePanel title='Gyldighetsperiode' elements={validityItems(variableDefinition)} columns={2} />
          <DetailsPagePanel title='Opprettet og siste endret' elements={createdAndEditedItems(variableDefinition)} columns={2} />
        </aside>
      </div>
    </section>
  );
}
