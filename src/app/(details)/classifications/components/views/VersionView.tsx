'use client';

import { Alert, Heading, Paragraph, Tabs, Tag } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { localization } from '@/libs/language';
import { classificationDetailsTabsData, getClassificationDetailsTabForRoute } from '../../[id]/tabs';
import { ResolvedVersion, VersionProvider } from '../versionContext';
import styles from './views.module.css';

interface VersionViewProps {
  classification: ClassificationResource;
  classificationVersion?: ClassificationVersionResource | null;
  children: React.ReactNode;
}

type ResolvedVersionResult = {
  version: ResolvedVersion;
  isLatest: boolean;
};

function resolveVersionFromPath(pathname: string, versions: ResolvedVersion[]): ResolvedVersionResult | null {
  const sorted = [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0));
  const latest = sorted.at(0);
  if (!latest) return null;

  const segments = pathname.split('/').filter(Boolean);
  const versionIndex = segments.indexOf('version');

  if (versionIndex >= 0) {
    const versionId = Number(segments[versionIndex + 1]);
    if (!Number.isNaN(versionId)) {
      const version = sorted.find((v) => v.id === versionId);
      if (version) return { version, isLatest: latest.id === versionId };
    }
  }

  return { version: latest, isLatest: true };
}

export function VersionView({ classification, classificationVersion, children }: Readonly<VersionViewProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getClassificationDetailsTabForRoute(pathname) ?? classificationDetailsTabsData.Codes;

  const versions = classification.versions ?? [];
  const resolved = resolveVersionFromPath(pathname, versions);

  if (!resolved) return null;

  const tabs = Object.values(classificationDetailsTabsData);

  const getTabUrl = (slug: string) =>
    resolved.isLatest
      ? `/classifications/${classification.id}/${slug}`
      : `/classifications/${classification.id}/version/${resolved.version.id}/${slug}`;

  useEffect(() => {
    // Changes can take 6s or more to load in so prefetch this to avoid the user having to wait on tab access
    router.prefetch(getTabUrl(classificationDetailsTabsData.Changes.slug));
  }, [router, classification.id, resolved.isLatest, resolved.version.id]);

  const validFromText =
    resolved.version.validFrom?.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) ?? '—';

  const versionTag = (
    <Tag data-color={'info'}>
      {`${localization.versions.tags.isLatest} (${localization.versions.tags.validFrom}: ${validFromText})`}
    </Tag>
  );

  return (
    <VersionProvider classification={classification} versionSummary={resolved.version} isLatest={resolved.isLatest}>
      {!resolved?.isLatest && (
        <Alert data-color={'danger'} role='status'>
          {localization.versions.tags.isNotCurrent}
        </Alert>
      )}
      <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='lg' level={2}>
        {resolved.version.name ?? '—'}
      </Heading>
      {resolved?.isLatest && versionTag}
      <Paragraph>{classificationVersion?.introduction ?? '—'}</Paragraph>
      <Tabs
        value={activeTab.id}
        onChange={(value) => {
          const nextTab = tabs.find((tab) => tab.id === value);
          if (nextTab) {
            router.push(getTabUrl(nextTab.slug));
          }
        }}
      >
        <Tabs.List className={styles.tabList} aria-label={localization.tabs.ariaLabel}>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id} value={tab.id} aria-controls={tab.id} className='font-roboto'>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel key={pathname} value={activeTab.id} id={activeTab.id} className={styles.tabsPanel}>
          {children}
        </Tabs.Panel>
      </Tabs>
    </VersionProvider>
  );
}
