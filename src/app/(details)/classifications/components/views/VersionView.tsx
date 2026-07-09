'use client';

import { Heading, Tabs, Tag } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language';
import { classificationDetailsTabsData, getClassificationDetailsTabForRoute } from '../../[id]/tabs';
import { ResolvedVersion, VersionContextType, VersionProvider } from '../versionContext';
import styles from './views.module.css';

interface VersionViewProps {
  classification: ClassificationResource;
  children: React.ReactNode;
}

function resolveVersionFromPath(pathname: string, versions: ResolvedVersion[]): VersionContextType | null {
  const versionMatch = pathname.match(/\/version\/(\d+)/);
  const sorted = [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0));

  if (versionMatch) {
    const versionId = Number(versionMatch[1]);
    const version = sorted.find((v) => v.id === versionId);
    if (!version) return null;
    return { version, isLatest: sorted[0]?.id === versionId };
  }

  // No versionId in URL — use latest
  const latest = sorted[0];
  if (!latest) return null;
  return { version: latest, isLatest: true };
}

export function VersionView({ classification, children }: Readonly<VersionViewProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getClassificationDetailsTabForRoute(pathname) ?? classificationDetailsTabsData.Codes;

  const versions = classification.versions ?? [];
  const resolved = resolveVersionFromPath(pathname, versions);

  const getTabUrl = (slug: string) => {
    if (resolved?.isLatest) {
      return `/classifications/${classification.id}/${slug}`;
    }
    return `/classifications/${classification.id}/version/${resolved?.version.id}/${slug}`;
  };

  return (
    <VersionProvider version={resolved?.version!} isLatest={resolved?.isLatest ?? false}>
      <Heading className={`${styles.detailsHeading} primaryHeading`} data-size='lg' level={2}>
        {resolved?.version.name ?? '—'}
      </Heading>
      {resolved?.isLatest && <Tag>Nyeste versjon</Tag>}
      <Tabs value={activeTab.id}>
        <Tabs.List className={styles.tabList} aria-label={localization.tabs.ariaLabel}>
          {Object.values(classificationDetailsTabsData).map((tab) => (
            <Tabs.Tab
              aria-controls={tab.id}
              key={tab.id}
              value={tab.id}
              className={`${styles.tab} font-roboto`}
              onClick={() => router.push(getTabUrl(tab.slug))}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value={activeTab.id} id={activeTab.id} className={styles.tabsPanel}>
          {children}
        </Tabs.Panel>
      </Tabs>
    </VersionProvider>
  );
}
