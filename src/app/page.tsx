import { Card, Heading } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { localization } from '@/libs/language';
import { tabs } from '@/utils/constants';

export default function Home() {
  return (
    <div id='pageContainer' className='container'>
      <header>
        <Heading level={2}>{localization.info.landingPageTitle}</Heading>
        <section>{localization.info.landingPageInfo}</section>
      </header>
      <main id='landingPageContent'>
        {tabs.map((item, index) => (
          <Card key={index} className='linkCard'>
            <Link key={index} href={item.href}>
              {item.label}
            </Link>
          </Card>
        ))}
      </main>
    </div>
  );
}
