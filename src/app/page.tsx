import { Alert, Card, Divider, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { ClientDetails } from '@/components/client-details/clientDetails';
import { localization } from '@/libs/language';
import { tabsData } from './(services)/tabs';
import styles from './home.module.css';

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

  return (
    <>
      <Alert data-color={'warning'} className='infoAlert' data-size={'md'}>
        Dataportalens forside er under arbeid.
      </Alert>
      <main className={`${styles.pageContainer} container`}>
        <Card data-color='brand1' variant='tinted' className={styles.headerCard}>
          <header className={styles.pageHeader}>
            <Heading level={1} data-size='xl' className={`${styles.pageTitle} heading12`}>
              {localization.info.landingPageTitle}
            </Heading>
            <Paragraph data-size='xl' className={styles.subTitle}>
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
        <nav className={styles.pageNavigation}>
          {Object.values(tabsData).map((item, index) => (
            <Link key={index} href={item.route}>
              {item.label}
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
