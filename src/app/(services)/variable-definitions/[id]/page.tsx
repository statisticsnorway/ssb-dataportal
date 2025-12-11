'use client';

import { Tag } from '@digdir/designsystemet-react';
import React from 'react';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPagePanel } from '@/components/details-page-panel/details-page-panel';
import { localization } from '@/libs/language';
import { testVardefData } from '@/utils/mock-data';
import { VardefHeading } from '../components/vardefHeading';
import styles from './variable-details-page.module.css';
import { contactItems, validityItems, ownerItems, referencesItems, createdAndEditedItems, unitTypesItems, personalDataItems } from './groups';
import { TextField } from '@/components/text-field';
import { convertStatus } from '@/utils/functions';
import { useParams } from 'next/navigation';

export default function VariableDefinition() {
  const params = useParams();
  const id = params?.id;

  const variableDefinition = testVardefData.variableDefinitions.find((v) => v.id === id);

  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: 'Variabeldefinisjoner', href: '/variable-definitions' };
  const breadcrumbList = variableDefinition.id ? ([{ text: variableDefinition.name, href: '' }] as BreadcrumbType[]) : [];

  return (
    <section className={`${styles.detailsPage} container`}>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        homeUrl={homeUrl}
        breadcrumbHomeAriaLabel={localization.navigateHomeVariableDefinitions}
      />
      <header className={styles.detailsPageHeader}>
        <VardefHeading headingProps={{ 'data-size': 'lg', level: 1 }} variableDefinition={variableDefinition} />
      </header>
      <div className={styles.contentGrid}>
        <article className={styles.mainColumn}>
          <section className={styles.mainSection}>
            <h2 className={styles.definitionTitle}>Definisjon</h2>
            <p className={styles.definition}>{variableDefinition.definition}</p>
            {variableDefinition.comment && (
              <TextField label='Kommentar' value={variableDefinition.comment} type='longtext' />
            )}
          </section>
          <DetailsPagePanel title='Kontakt' elements={contactItems(variableDefinition)} columns={2} />
          <DetailsPagePanel title='Personopplysninger' elements={personalDataItems(variableDefinition)} />
          <DetailsPagePanel title='Eier' elements={ownerItems(variableDefinition)} columns={2} />
        </article>
        <aside className={styles.sidebar}>
          <section className={styles.idAndTagRow}>
            <div className={styles.idField}>
              <span className={styles.idLabel}>ID</span>
              <span className={styles.idValue}>{variableDefinition.id}</span>
            </div>
            <Tag className={styles.variableStatusTag} data-size="lg" data-color="info">
              {convertStatus(variableDefinition.variableStatus)}
            </Tag>
          </section>
          <DetailsPagePanel title='Enhetstyper og statistikkområder' elements={unitTypesItems(variableDefinition)} />
          <DetailsPagePanel title='Referanser' elements={referencesItems(variableDefinition)} />
          <DetailsPagePanel title='Gyldighetsperiode' elements={validityItems(variableDefinition)} columns={2} />
          <DetailsPagePanel title='Opprettet og siste endret' elements={createdAndEditedItems(variableDefinition)} columns={2} />
        </aside>
      </div>
    </section>
  );
}
