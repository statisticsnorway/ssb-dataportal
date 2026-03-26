import { Card, Heading } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import { NavigationCard } from '@/components/navigation-card';
import AlphabetIcon from '@/icons/alphabet.svg';
import DatasetIcon from '@/icons/dataset.svg';
import NetworkIcon from '@/icons/networks.svg';
import { localization } from '@/libs/language';
import { tabsData } from './(services)/tabs';
import styles from './home.module.css';
import './home.css';
import { ClientDetails } from '@/components/client-details/clientDetails';

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

  const navigationItems: Record<string, { label: string; route: string; icon: ReactNode | null; id: string }> =
    Object.fromEntries(
      Object.entries(tabsData).map(([key, value]) => {
        let icon: ReactNode | null = null;

        switch (value.label) {
          case localization.tabs.variableDefinitions:
            icon = <AlphabetIcon aria-hidden='true' />;
            break;
          case localization.tabs.classifications:
            icon = <NetworkIcon aria-hidden='true' />;
            break;
          case localization.tabs.datasets:
            icon = <DatasetIcon aria-hidden='true' />;
            break;
        }

        return [key, { ...value, icon }];
      }),
    );

  return (
    <div className={styles.background}>
      <main className='container'>
        <Card data-color='brand1' variant='tinted' className={styles.headerCard}>
          <header className={styles.pageHeader}>
            <Heading level={1} data-size='lg' className={`${styles.pageTitle} heading12`}>
              {localization.info.landingPageTitle}
            </Heading>
            <Heading level={2} data-size='md' className={`${styles.subTitle} heading345`}>
              {localization.info.landingPageSubTitle}
            </Heading>
            <div className={styles.infoDetails}>
              {detailsList.map((detail, index) => (
                <Card key={index} className={styles.infoCard}>
                  <ClientDetails summary={detail.summary} content={detail.content} />
                </Card>
              ))}
            </div>
          </header>
        </Card>
        <nav className={styles.pageNavigation} id='menu'>
          {Object.values(navigationItems).map((item, index) => (
            <NavigationCard id={item.id} key={item.id} title={item.label} href={item.route} icon={item.icon} />
          ))}
        </nav>
      </main>
    </div>
  );
}
