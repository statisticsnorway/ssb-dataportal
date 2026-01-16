'use client';

import { Button, Tag } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { CodeSnippet } from '@/app/(services)/variable-definitions/components/codeSnippet';
import { COPIED_LABEL, COPY_ID_LABEL } from '@/app/(services)/variable-definitions/components/constants';
import { Breadcrumbs, BreadcrumbType } from '@/components/breadcrumbs';
import { DetailsPagePanel } from '@/components/details-page-panel/details-page-panel';
import { TextField } from '@/components/text-field';
import { useClipboard } from '@/hooks/useClipboard';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { convertStatus, nonEmpty } from '@/utils/functions';
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

export default function VariableDefinitionDetail({ variableDefinition }: { variableDefinition: RenderedView }) {
  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: 'Variabeldefinisjoner', href: '/variable-definitions' };
  const breadcrumbList = variableDefinition.id
    ? ([{ text: variableDefinition.name, href: '' }] as BreadcrumbType[])
    : [];
  const references = nonEmpty(referencesItems(variableDefinition));
  const { copied, copyToClipboard } = useClipboard();

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
          <section
            className={styles.mainSection}
            aria-label={variableDefinition.comment ? 'Variabeldefinisjon med kommentar' : 'Variabeldefinisjon'}
          >
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
          <CodeSnippet
            title='Python kode for å hente variabeldefinisjon'
            code={[
              `Vardef.get_variable_definition_by_shortname(`,
              `    short_name="${variableDefinition.short_name}"`,
              `)`,
            ]}
          />
        </article>
        <aside className={styles.sidebar}>
          <section className={styles.idAndTagRow}>
            <div className={styles.idField}>
              <span className={styles.idLabel}>ID</span>
              <span className={styles.idValue}>{variableDefinition.id}</span>
              <Button
                title={COPY_ID_LABEL}
                className='copyButton'
                icon
                onClick={() => copyToClipboard(variableDefinition.id)}
                aria-label={copied ? COPIED_LABEL : COPY_ID_LABEL}
              >
                {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
              </Button>
            </div>
            <Tag className={styles.variableStatusTag} data-size='lg' data-color='info'>
              {convertStatus(variableDefinition.variable_status)}
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
