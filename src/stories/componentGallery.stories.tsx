import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { composeStory } from '@storybook/nextjs-vite';
import type { ComponentType } from 'react';
import preview from '../../.storybook/preview';
import styles from './componentGallery.module.css';

type StoryModule = {
  default: Parameters<typeof composeStory>[1] & { title?: string };
  [exportName: string]: unknown;
};

const storyModules = {
  ...import.meta.glob<StoryModule>('../components/**/*.stories.tsx', { eager: true }),
  ...import.meta.glob<StoryModule>('../app/**/*.stories.tsx', { eager: true }),
};

const stories = Object.entries(storyModules)
  .flatMap(([path, module]) => {
    const [exportName, story] = Object.entries(module).find(([name]) => name !== 'default') ?? [];

    if (!exportName || !story || !module.default.title) {
      return [];
    }

    const ComposedStory = composeStory(
      story as Parameters<typeof composeStory>[0],
      module.default,
      preview,
      exportName,
    ) as unknown as ComponentType;

    return [
      {
        id: `${module.default.title}/${exportName}`,
        title: module.default.title,
        Story: ComposedStory,
        path,
      },
    ];
  })
  .sort((left, right) => left.title.localeCompare(right.title));

const wideComponentNames = new Set([
  'ChangesView',
  'ClassificationDetail',
  'ClassificationsServicePage',
  'CodesView',
  'CorrespondenceDetailView',
  'CorrespondenceTable',
  'CorrespondenceTableWithDirection',
  'CorrespondencesView',
  'DataProductDetail',
  'DataProductsServicePage',
  'DatasetDetail',
  'DatasetFilters',
  'DatasetVariableList',
  'DatasetWorkspace',
  'ResultsSection',
  'VariantsView',
  'VersionView',
  'VariableDefinitionDetail',
  'VariableDefinitionsServicePage',
]);

const storyGroups = stories.reduce<Map<string, typeof stories>>((groups, story) => {
  const [category, feature] = story.title.split('/');
  const group = category === 'Feature' ? (feature ?? 'Features') : (category ?? 'Components');
  const groupStories = groups.get(group);

  if (groupStories) {
    groupStories.push(story);
  } else {
    groups.set(group, [story]);
  }

  return groups;
}, new Map());

const orderedStoryGroups = [...storyGroups.entries()].sort(([left], [right]) => {
  if (left === 'Components') return -1;
  if (right === 'Components') return 1;
  return left.localeCompare(right);
});

function formatGroupTitle(group: string) {
  return group.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function ComponentGallery() {
  return (
    <main className={styles.gallery}>
      <header className={styles.header}>
        <h1 className={`primaryHeading ${styles.title}`}>Component gallery</h1>
        <p className={styles.description}>A visual overview of shared components and feature samples.</p>
      </header>
      {orderedStoryGroups.map(([group, groupStories]) => (
        <section className={styles.group} key={group} aria-labelledby={`component-gallery-${group}`}>
          <h2 className={`secondaryHeading ${styles.groupTitle}`} id={`component-gallery-${group}`}>
            {formatGroupTitle(group)}
          </h2>
          <div className={styles.grid}>
            {groupStories.map(({ id, title, Story }) => {
              const componentName = title.split('/').at(-1) ?? 'Component';

              return (
                <div
                  key={id}
                  className={`${styles.item} ${wideComponentNames.has(componentName) ? styles.wideItem : ''}`}
                  role='group'
                  aria-label={`${componentName} preview`}
                >
                  <Story />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}

const meta = {
  title: 'Overview/All Components',
  component: ComponentGallery,
} satisfies Meta<typeof ComponentGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
