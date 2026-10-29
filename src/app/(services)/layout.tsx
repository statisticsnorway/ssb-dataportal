'use client';

import { Details, Heading, Paragraph, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ComponentRef, ReactNode, useCallback, useEffect, useRef } from 'react';
import { localization } from '@/libs/language';
import styles from './search-layout.module.css';
import { tabBanners } from './tab-banners';
import { getTabForRoute, tabsData } from './tabs';

export default function SearchLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = getTabForRoute(pathname) ?? tabsData.VariableDefinitions;
  const ActiveBanner = tabBanners[activeTab.id];
  const tabListRef = useRef<ComponentRef<typeof Tabs.List>>(null);

  const revealActiveTab = useCallback(() => {
    const tabList = tabListRef.current;
    const tab = tabList?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!tabList || !tab || tabList.scrollWidth <= tabList.clientWidth) return;

    const listRect = tabList.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const tabCenter = tabRect.left - listRect.left + tabList.scrollLeft + tabRect.width / 2;
    const maxScrollLeft = tabList.scrollWidth - tabList.clientWidth;
    const left = Math.min(Math.max(tabCenter - tabList.clientWidth / 2, 0), maxScrollLeft);
    if (typeof tabList.scrollTo === 'function') {
      tabList.scrollTo({ left, behavior: 'auto' });
    } else {
      tabList.scrollLeft = left;
    }
  }, []);

  useEffect(() => {
    revealActiveTab();
  }, [activeTab.id, revealActiveTab]);

  useEffect(() => {
    window.addEventListener('resize', revealActiveTab);
    return () => window.removeEventListener('resize', revealActiveTab);
  }, [revealActiveTab]);

  return (
    <Tabs className={styles.tabsContainer} value={activeTab.id}>
      <section aria-labelledby='dataportal-intro-title' className={`services-tab-band ${styles.tabBand}`}>
        {ActiveBanner && (
          <div className='container'>
            <ActiveBanner />
          </div>
        )}
        <div className={`${styles.intro} container`}>
          <Heading
            id='dataportal-intro-title'
            level={2}
            data-size='xl'
            className={`primaryHeading ${styles.introTitle}`}
          >
            {localization.appTitle}
          </Heading>
          {localization.appSubTitle.map((paragraph) => (
            <Paragraph key={paragraph} className={styles.introText}>
              {paragraph}
            </Paragraph>
          ))}
          <Details className={styles.aboutDetails}>
            <Details.Summary>{localization.info.aboutDataportal.toggle}</Details.Summary>
            <Details.Content className={styles.aboutContent}>
              <Heading level={3} data-size='sm' className='secondaryHeading'>
                {localization.info.aboutDataportal.title}
              </Heading>
              {localization.info.aboutDataportal.body.map((paragraph) => (
                <Paragraph key={paragraph}>{paragraph}</Paragraph>
              ))}
            </Details.Content>
          </Details>
        </div>
      </section>
      <nav className={`${styles.tabsNavigationContainer} container`}>
        <Tabs.List ref={tabListRef} aria-label={localization.tabs.ariaLabel}>
          {Object.values(tabsData).map((tab) => (
            <Tabs.Tab
              aria-controls={tab.id}
              key={tab.id}
              value={tab.id}
              className={`${styles.tab} font-roboto`}
              onClick={() => router.push(tab.route)}
            >
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </nav>
      {children}
    </Tabs>
  );
}
