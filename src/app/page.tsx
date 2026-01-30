import { Alert, Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import ClientOnly from '@/components/client-details/clientOnly';
import { localization } from '@/libs/language';
import { tabsData } from './(services)/tabs';
import styles from './home.module.css';

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
      <div className='container'>
        <main className={styles.pageContainer}>
          <Card className={styles.headerCard}>
            <header className={styles.header}>
              <Heading level={1} data-size='xl' className={styles.title}>
                {localization.info.landingPageTitle}
              </Heading>
              <Paragraph data-size='xl' className={styles.subTitle}>
                {localization.info.landingPageSubTitle}
              </Paragraph>
              {detailsList.map((detail, index) => (
                <Card key={index} style={{ marginBottom: '1rem' }}>
                  <ClientOnly summary={detail.summary} content={detail.content} />
                </Card>
              ))}
            </header>
          </Card>
          <nav className={styles.landingPageContent}>
            {Object.values(tabsData).map((item, index) => (
              <Link key={index} href={item.route}>
                {item.label}
              </Link>
            ))}
          </nav>
        </main>
      </div>
    </>
  );
}
