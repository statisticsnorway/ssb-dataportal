'use client';

import { Alert, Divider, Heading, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppNotFoundState } from '@/components/app-state';
import { DetailsList } from '@/components/details-list';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import { fetchVersionById } from '@/libs/data/classifications/versionsData';
import { ClassificationVersionResource } from '@/libs/data-access/klass/models/ClassificationVersionResource';
import { localization } from '@/libs/language';
import { formatLocaleDate } from '@/utils/functions';
import { classificationDetailsTabsData, getClassificationDetailsTabForRoute } from '../../[id]/tabs';
import { BuildUrlProps, buildUrl } from '../../utils/urls';
import { ResolvedVersion, VersionProvider } from '../versionContext';
import styles from './views.module.css';

interface VersionViewProps {
  classification: ClassificationWithLanguage;
  classificationVersion?: ClassificationVersionResource | null;
  missingInSelectedLanguage?: boolean;
  children: React.ReactNode;
}

type ResolvedVersionResult = {
  version: ResolvedVersion;
  isLatest: boolean;
};

type TabSlug = NonNullable<BuildUrlProps['tab']>;

function resolveVersionFromPath(pathname: string, versions: ResolvedVersion[]): ResolvedVersionResult | null {
  const sorted = [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0));
  const latest = sorted.at(0);
  if (!latest) return null;

  const segments = pathname.split('/').filter(Boolean);
  const versionIndex = segments.indexOf('versions');

  if (versionIndex >= 0) {
    const versionId = Number(segments[versionIndex + 1]);
    if (!Number.isInteger(versionId)) return null;

    const version = sorted.find((v) => v.id === versionId);
    return version ? { version, isLatest: latest.id === versionId } : null;
  }

  return { version: latest, isLatest: true };
}

export function VersionView({
  classification,
  classificationVersion: versionOnEntry,
  missingInSelectedLanguage,
  children,
}: Readonly<VersionViewProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getClassificationDetailsTabForRoute(pathname) ?? classificationDetailsTabsData.Codes;

  const versions = classification.versions ?? [];
  const resolved = resolveVersionFromPath(pathname, versions);

  const [displayedVersion, setDisplayedVersion] = useState<ClassificationVersionResource | null | undefined>(
    versionOnEntry,
  );

  useEffect(() => {
    const resolvedVersionId = resolved?.version.id;
    if (resolvedVersionId === undefined || displayedVersion?.id === resolvedVersionId) {
      return;
    }

    let cancelled = false;
    fetchVersionById(resolvedVersionId, localization.getLanguage() as 'nb' | 'nn' | 'en').then((result) => {
      if (!cancelled) {
        setDisplayedVersion(result ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [resolved?.version.id, displayedVersion?.id]);

  if (!resolved) {
    return (
      <AppNotFoundState
        title={localization.error.notFoundTitleVersionDetails}
        message={localization.error.notFoundMessageVersionDetails}
        helpList={localization.error.notFoundHelpListVersionDetails}
        homeHref={buildUrl({})}
        homeLabel={localization.classification.labelPlural}
        secondaryHref={`/classifications/${classification.id}`}
        secondaryLabel={localization.classification.labelSingular}
        showBrokenLinkButton={false}
      />
    );
  }

  const tabs = Object.values(classificationDetailsTabsData);

  const getTabUrl = (tab: TabSlug) =>
    resolved.isLatest
      ? buildUrl({ classificationId: classification.id, tab })
      : buildUrl({ classificationId: classification.id, versionId: resolved.version.id, tab });

  useEffect(() => {
    const versionPath = buildUrl({ classificationId: classification.id, versionId: resolved.version.id });
    if (pathname === versionPath) {
      router.replace(`${versionPath}/${classificationDetailsTabsData.Codes.slug}`);
      return;
    }

    // Changes can take 6s or more to load in so prefetch this to avoid the user having to wait on tab access
    router.prefetch(getTabUrl(classificationDetailsTabsData.Changes.slug));
  }, [router, pathname, classification.id, resolved.isLatest, resolved.version.id]);

  return (
    <VersionProvider classification={classification} versionSummary={resolved.version} isLatest={resolved.isLatest}>
      <Divider data-version-divider />
      {!resolved?.isLatest && (
        <Alert data-color={'danger'} role='status'>
          {localization.versions.tags.isNotCurrent}
        </Alert>
      )}
      <Heading
        className={`${styles.detailsHeading} secondaryHeading`}
        data-size='md'
        level={2}
        {...(classification.fallbackLanguage ? { lang: classification.fallbackLanguage } : {})}
      >
        {resolved.version.name ?? localization.noDataPlaceholder}
      </Heading>
      <DetailsList
        content={[
          { label: localization.validity.validFrom, value: formatLocaleDate(resolved.version.validFrom) || '—' },
          { label: localization.validity.validTo, value: formatLocaleDate(resolved.version.validTo) || '—' },
        ]}
        fallbackLanguage={classification.fallbackLanguage}
      />
      {missingInSelectedLanguage && (
        <Alert data-color={'warning'} role='alert'>
          {localization.classification.language.missingInSelectedLanguage}
        </Alert>
      )}
      <p
        className={styles.introduction}
        {...(classification.fallbackLanguage ? { lang: classification.fallbackLanguage } : {})}
      >
        {displayedVersion?.introduction ?? localization.noDataPlaceholder}
      </p>
      <Tabs
        value={activeTab.id}
        onChange={(value) => {
          const nextTab = tabs.find((tab) => tab.id === value);
          if (nextTab) {
            router.push(getTabUrl(nextTab.slug as TabSlug));
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
