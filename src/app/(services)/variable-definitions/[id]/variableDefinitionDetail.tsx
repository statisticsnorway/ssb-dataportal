'use client';

import { Button, Tag } from '@digdir/designsystemet-react';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import { CodeSnippet } from '@/app/(services)/variable-definitions/components/codeSnippet';
import { PYPI_DAPLA_TOOLBELT_METADATA_URL } from '@/app/(services)/variable-definitions/components/constants';
import { tabsData } from '@/app/tabs';
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

export default function VariableDefinitionDetail({
  variableDefinition,
}: {
  variableDefinition: RenderedView | undefined;
}) {
  if (!variableDefinition) {
    return <div>Variabeldefinisjon ikke funnet</div>;
  }

  const homeUrl = { text: localization.variableDefinition.labelPlural, href: tabsData.VariableDefinitions.route };
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
            aria-label={
              variableDefinition.comment
                ? localization.variableDefinition.labelWithComment
                : localization.variableDefinition.labelSingular
            }
          >
            <p className={styles.definition}>{variableDefinition.definition}</p>
            {variableDefinition.comment && (
              <dl>
                <TextField label={localization.comment} value={variableDefinition.comment} type='text' />
              </dl>
            )}
          </section>
          <DetailsPagePanel elements={contactItems(variableDefinition)} columns={2} />
          <DetailsPagePanel elements={personalDataItems(variableDefinition)} />
          <DetailsPagePanel title={localization.owner.label} elements={ownerItems(variableDefinition)} columns={2} />
          <CodeSnippet
            title={
              <p className={styles.codeSnippetTitle}>
                <span className={styles.titleMain}>
                  <img src='/python-logo-only.svg' alt='' className={styles.pythonIcon} />{' '}
                  {localization.variableDefinition.fetchWith}
                </span>
                <a
                  href={PYPI_DAPLA_TOOLBELT_METADATA_URL}
                  target='_blank'
                  rel='noreferrer'
                  className={styles.titleLink}
                >
                  dapla-toolbelt-metadata
                </a>
              </p>
            }
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
                title={localization.copy.id}
                className='copyButton'
                icon
                onClick={() => copyToClipboard(variableDefinition.id)}
                aria-label={copied ? localization.copy.copied : localization.copy.id}
              >
                {copied ? <ClipboardCheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
              </Button>
            </div>
            <Tag className={styles.variableStatusTag} data-size='lg' data-color='info'>
              {convertStatus(variableDefinition.variable_status)}
            </Tag>
          </section>
          <DetailsPagePanel title={localization.context} elements={unitTypesItems(variableDefinition)} />
          {references.length > 0 && <DetailsPagePanel title={localization.references} elements={references} />}
          <DetailsPagePanel
            title={localization.validity.label}
            elements={validityItems(variableDefinition)}
            columns={2}
          />
          <DetailsPagePanel elements={createdAndEditedItems(variableDefinition)} columns={2} />
        </aside>
      </div>
    </section>
  );
}
