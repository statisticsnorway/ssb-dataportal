'use client';

import { Card, Heading, Search, Tag } from '@digdir/designsystemet-react';
import { useMemo, useState } from 'react';
import type { DatasetVariableDTO } from '@/libs/data-access/datadoc';
import { localization } from '@/libs/language';
import { formatParquetType } from '@/utils/formatParquetType';
import styles from './variable-list-gallery.module.css';

type VariableListStyle = 'open' | 'compact' | 'nameHighlight' | 'colored' | 'tags';

type VariableListShowcaseProps = Readonly<{
  datasetId: string;
  variables: DatasetVariableDTO[];
  hasError: boolean;
}>;

const variableExamples: ReadonlyArray<{ id: string; title: string; description: string; style: VariableListStyle }> = [
  {
    id: 'open',
    title: 'Open text grid',
    description: 'Neutral-tinted items use whitespace instead of outlines to separate variables.',
    style: 'open',
  },
  {
    id: 'compact',
    title: 'Compact grid',
    description: 'Pale blue items, smaller type, and tighter spacing fit more variables across the page.',
    style: 'compact',
  },
  {
    id: 'name-highlight',
    title: 'Highlighted variable names',
    description: 'Lavender-tinted items and a larger variable name make the hierarchy clearer.',
    style: 'nameHighlight',
  },
  {
    id: 'colored-background',
    title: 'Tinted item backgrounds',
    description: 'A soft Designsystemet background color distinguishes each item, without any surrounding border.',
    style: 'colored',
  },
  {
    id: 'tags',
    title: 'Type values as tags',
    description: 'Soft green items pair with Designsystemet tags for the physical and logical types.',
    style: 'tags',
  },
];

function displayType(type: string | null | undefined) {
  return type ? formatParquetType(type) : localization.datasetDetail.notSpecified;
}

function VariableRows({ variables, style }: Readonly<{ variables: DatasetVariableDTO[]; style: VariableListStyle }>) {
  return (
    <ul className={`${styles.variableList} ${styles[style] ?? ''}`}>
      {variables.length === 0 ? (
        <li className={styles.variableNoHits}>
          <output>{localization.search.noHits}</output>
        </li>
      ) : (
        variables.map((variable) => {
          const types = [
            [localization.datasetDetail.physicalType, variable.physical_type],
            [localization.datasetDetail.logicalType, variable.logical_type],
          ] as const;

          return (
            <li className={styles.variableItem} key={variable.id}>
              <code className={styles.variableName}>{variable.short_name}</code>
              <dl className={styles.variableTypes}>
                {types.map(([label, typeName]) => (
                  <div key={label} className={styles.variableType}>
                    <dt>{label}</dt>
                    <dd className={typeName ? undefined : styles.variableTypeMissing}>
                      {style === 'tags' && typeName ? (
                        <Tag data-color='magic' data-size='sm'>
                          {displayType(typeName)}
                        </Tag>
                      ) : (
                        displayType(typeName)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })
      )}
    </ul>
  );
}

export default function VariableListShowcase({ datasetId, variables, hasError }: VariableListShowcaseProps) {
  const [query, setQuery] = useState('');
  const language = localization.getLanguage();
  const normalizedQuery = query.trim().toLocaleLowerCase(language);
  const filteredVariables = useMemo(
    () =>
      variables
        .filter((variable) => {
          const searchableText = [variable.short_name, variable.physical_type, variable.logical_type]
            .filter(Boolean)
            .join(' ')
            .toLocaleLowerCase(language);
          return searchableText.includes(normalizedQuery);
        })
        .toSorted((a, b) => a.short_name.localeCompare(b.short_name, language)),
    [language, normalizedQuery, variables],
  );

  return (
    <main className={`${styles.page} container`} data-testid='variable-list-showcase'>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Dataset variables</p>
        <Heading level={1} className='primaryHeading' data-size='xl'>
          Five fresh ways to arrange the variable list
        </Heading>
        <p className={styles.intro}>
          All five examples use multiple items per row and keep the familiar structure: variable name first, then
          physical and logical type beneath it. None use borders around the individual items.
        </p>
        <code className={styles.datasetId}>{datasetId}</code>
      </header>

      <section className={styles.toolbar} aria-label='Search and results'>
        <Search>
          <Search.Input
            aria-label='Search variable names or types'
            placeholder='Search variable names or types'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Search.Clear onClick={() => setQuery('')} />
        </Search>
        <p className={styles.resultCount} aria-live='polite'>
          Showing {filteredVariables.length} of {variables.length} variables
        </p>
      </section>

      {hasError ? (
        <p className={styles.errorMessage} role='alert'>
          The variables could not be loaded. Try refreshing the page.
        </p>
      ) : null}

      <nav className={styles.exampleNavigation} aria-label='Jump to an example'>
        {variableExamples.map((example, index) => (
          <a key={example.id} href={`#${example.id}`}>
            <span>{index + 1}</span> {example.title}
          </a>
        ))}
      </nav>

      <div className={styles.examples}>
        {variableExamples.map((example, index) => (
          <section
            id={example.id}
            className={styles.exampleSection}
            aria-labelledby={`${example.id}-heading`}
            key={example.id}
          >
            <div className={styles.exampleHeading}>
              <div>
                <p className={styles.exampleNumber}>Example {index + 1}</p>
                <Heading level={2} id={`${example.id}-heading`} className='secondaryHeading' data-size='lg'>
                  {example.title}
                </Heading>
              </div>
              <p className={styles.exampleDescription}>{example.description}</p>
            </div>
            <Card className={styles.exampleCard}>
              <VariableRows variables={filteredVariables} style={example.style} />
            </Card>
          </section>
        ))}
      </div>
    </main>
  );
}
