'use client';

import { Button, Tag } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPagePanel } from '@/components/details-page-panel/details-page-panel';
import { TextField } from '@/components/text-field';
import { localization } from '@/libs/language';
import { convertStatus, nonEmpty } from '@/utils/functions';
import { testVardefData } from '@/utils/mock-data';
import { VardefHeading } from '../components/vardefHeading';
import {
  contactItems,
  createdAndEditedItems,
  ownerItems,
  personalDataItems,
  referencesItems,
  unitTypesItems,
  validityItems,
} from './groups';
import styles from './variable-details-page.module.css';

export default function VariableDefinition() {
  const params = useParams();
  const id = params?.id;

  const variableDefinition = testVardefData.variableDefinitions.find((v) => v.id === id);

  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: 'Variabeldefinisjoner', href: '/variable-definitions' };
  const breadcrumbList = variableDefinition.id
    ? ([{ text: variableDefinition.name, href: '' }] as BreadcrumbType[])
    : [];

  const references = nonEmpty(referencesItems(variableDefinition));

  const [copied, setCopied] = useState(false);

  /**
   * Copies the `id` from `variableDefinition` to the clipboard.
   *
   * Sets the `copied` state to `true` for 2.5 seconds to indicate a successful copy.
   * If the copy fails, an error is logged to the console.
   *
   * @async
   * @function handleCopyId
   */
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(variableDefinition.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Kopiering av ID mislyktes', err);
    }
  };

  return (
    <section className={`${styles.detailsPage} container`}>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        homeUrl={homeUrl}
        breadcrumbHomeAriaLabel={localization.navigateHomeVariableDefinitions}
      />
      <header className={styles.detailsPageHeader}>
        <VardefHeading headingProps={{ 'data-size': 'xl', level: 1 }} variableDefinition={variableDefinition} />
      </header>
      <div className={styles.contentGrid}>
        <article className={styles.mainColumn}>
          <section className={styles.mainSection}>
            <h2 className={styles.definitionTitle}>Definisjon</h2>
            <p className={styles.definition}>{variableDefinition.definition}</p>
            {variableDefinition.comment && (
              <dl>
                <TextField label='Kommentar' value={variableDefinition.comment} type='text' />
              </dl>
            )}
          </section>
          <DetailsPagePanel elements={contactItems(variableDefinition)} columns={2} />
          <DetailsPagePanel elements={personalDataItems(variableDefinition)} />
          <DetailsPagePanel title='Eier' elements={ownerItems(variableDefinition)} columns={2} />
        </article>
        <aside className={styles.sidebar}>
          <section className={styles.idAndTagRow}>
            <div className={styles.idField}>
              <span className={styles.idLabel}>ID</span>
              <span className={styles.idValue}>{variableDefinition.id}</span>
              <Button
                title='Kopier ID'
                aria-live='assertive'
                className={styles.copyId}
                icon
                onClick={handleCopyId}
                aria-label={copied ? 'Kopiert' : 'Kopier ID'}
              >
                {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
              </Button>
            </div>
            <Tag className={styles.variableStatusTag} data-size='lg' data-color='info'>
              {convertStatus(variableDefinition.variableStatus)}
            </Tag>
          </section>
          <DetailsPagePanel title='Enhetstyper og statistikkområder' elements={unitTypesItems(variableDefinition)} />
          {references.length > 0 && <DetailsPagePanel title='Referanser' elements={references} />}
          <DetailsPagePanel title='Gyldighetsperiode' elements={validityItems(variableDefinition)} columns={2} />
          <DetailsPagePanel
            title='Opprettet og siste endret'
            elements={createdAndEditedItems(variableDefinition)}
            columns={2}
          />
        </aside>
      </div>
    </section>
  );
}
