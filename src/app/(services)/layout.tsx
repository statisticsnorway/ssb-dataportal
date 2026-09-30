'use client';

import { Details, Heading, Paragraph, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { localization } from '@/libs/language';
import styles from './search-layout.module.css';
import { tabBanners } from './tab-banners';
import { getTabForRoute, tabsData } from './tabs';

export default function SearchLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = getTabForRoute(pathname) ?? tabsData.VariableDefinitions;
  const ActiveBanner = tabBanners[activeTab.id];

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
        <Tabs.List aria-label={localization.tabs.ariaLabel}>
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
