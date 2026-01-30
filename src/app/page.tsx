import { Alert, Card, Divider, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import ClientOnly from '@/components/client-details/clientOnly';
import { localization } from '@/libs/language';
import { tabsData } from './(services)/tabs';
import styles from './home.module.css';

//TODO: check class names - remove unused div
// Add div to background
// add titles to localization
export default function Home() {
  const detailsList = [
    {
      summary: 'Hva er Dataportalen?',
      content: localization.info.landingPageInfoIntro,
    },
    {
      summary: 'Hvorfor Dataportalen?',
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
      {/* <div className={`${styles.background} rootContainer`}>*/}
      <main className={`${styles.pageContainer} container`}>
        <Card data-color='brand1' variant='tinted' className={styles.headerCard}>
          <header className={styles.header}>
            <Heading level={1} data-size='xl' className={styles.title}>
              {localization.info.landingPageTitle}
            </Heading>
            <Paragraph data-size='xl' className={styles.subTitle}>
              {localization.info.landingPageSubTitle}
            </Paragraph>
            <div className={styles.infoDetails}>
              {detailsList.map((detail, index) => (
                <Card key={index} className={styles.infoCards}>
                  <ClientOnly summary={detail.summary} content={detail.content} />
                </Card>
              ))}
            </div>
          </header>
        </Card>
        <Divider className={styles.customDivider} />
        <nav className={styles.landingPageContent}>
          {Object.values(tabsData).map((item, index) => (
            <Link key={index} href={item.route}>
              {item.label}
            </Link>
          ))}
        </nav>
      </main>
      {/* </div>*/}
    </>
  );
}
