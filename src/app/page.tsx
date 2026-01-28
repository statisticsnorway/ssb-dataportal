import { Heading } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { localization } from '@/libs/language';
import { tabs } from '@/utils/constants';

export default function Home() {
  return (
    <div className='pageContainer container'>
      <header>
        <Heading level={2}>{localization.info.landingPageTitle}</Heading>
        <section>{localization.info.landingPageInfo}</section>
      </header>
      <main>
        {tabs.map((item, index) => (
          <Link key={index} href={item.href}>
            {item.label}
          </Link>
        ))}
      </main>
    </div>
  );
}
