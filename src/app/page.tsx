import { Card, Divider, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { ClientDetails } from '@/components/client-details/clientDetails';
import { NavigationCard } from '@/components/navigation-card';
import AlphabetIcon from '@/icons/alphabet.svg';
import DatasetIcon from '@/icons/dataset.svg';
import NetworkIcon from '@/icons/networks.svg';
import { localization } from '@/libs/language';
import { tabsData } from './(services)/tabs';
import styles from './home.module.css';
import './home.css';

export default function Home() {
  const detailsList = [
    {
      summary: localization.info.landingPageInfoIntroTitle,
      content: localization.info.landingPageInfoIntro,
    },
    {
      summary: localization.info.landingPageInfoGoalTitle,
      content: localization.info.landingPageInfoGoal,
    },
    {
      summary: localization.info.landingPagePrototypeTitle,
      content: localization.info.landingPageInfoPrototype,
    },
  ];

  const navigationItems: Record<string, { label: string; route: string; icon: ReactNode | null }> = Object.fromEntries(
    Object.entries(tabsData).map(([key, value]) => {
      let icon: ReactNode | null = null;

      switch (value.label) {
        case localization.tabs.variableDefinitions:
          icon = <AlphabetIcon title='a11y-title' />;
          break;
        case localization.tabs.classifications:
          icon = <NetworkIcon title='a11y-title' />;
          break;
        case localization.tabs.datasets:
          icon = <DatasetIcon title='a11y-title' />;
          break;
        default:
          icon = null;
      }

      return [key, { ...value, icon }];
    }),
  );

  return (
    <main className={`${styles.pageContainer} container`}>
      <Card data-color='brand1' variant='tinted' className={styles.headerCard}>
        <header className={styles.pageHeader}>
          <Heading level={1} data-size='lg' className={styles.pageTitle}>
            {localization.info.landingPageTitle}
          </Heading>
          <Paragraph data-size='md' className={styles.subTitle}>
            {localization.info.landingPageSubTitle}
          </Paragraph>
          <div className={styles.infoDetails}>
            {detailsList.map((detail, index) => (
              <Card key={index} className={styles.infoCard}>
                <ClientDetails summary={detail.summary} content={detail.content} />
              </Card>
            ))}
          </div>
        </header>
      </Card>
      <Divider className={styles.customDivider} />
      <nav className={styles.pageNavigation} id='menu'>
        {Object.values(navigationItems).map((item, index) => (
          <NavigationCard key={index} title={item.label} href={item.route} icon={item.icon} />
        ))}
      </nav>
    </main>
  );
}
