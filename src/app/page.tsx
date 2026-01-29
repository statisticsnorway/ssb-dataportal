import { Heading, Paragraph } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { localization } from '@/libs/language';
import { tabsData } from './(services)/tabs';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className='container'>
      <div className={styles.pageContainer}>
        <header>
          <Heading level={2} data-size='xl' className={styles.title}>
            {localization.info.landingPageTitle}
          </Heading>
          <Paragraph data-size='md' className={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus risus elit, rhoncus id rutrum at, aliquam
            et lacus. Nam non ipsum augue. Vestibulum lorem mi, venenatis tristique commodo ac, auctor ac purus. Nunc et
            eros id magna suscipit commodo. Sed imperdiet, lacus et sodales cursus, dui augue tempor sem, viverra
            bibendum leo mi ac dui. Vivamus eget finibus lorem, sit amet bibendum arcu. Morbi porttitor convallis
            semper. Quisque venenatis congue quam, ac pretium justo eleifend eu. Proin aliquam pellentesque leo eu
            semper. Sed vitae mi sit amet enim commodo blandit ut a ligula. Ut malesuada orci arcu, id accumsan felis
            commodo nec. Mauris eu ipsum nec arcu placerat dictum. Aliquam eget fringilla erat, eu lacinia magna.
            Interdum et malesuada fames ac ante ipsum primis in faucibus.
          </Paragraph>
        </header>
        <main className={styles.landingPageContent}>
          {Object.values(tabsData).map((item, index) => (
            <Link key={index} href={item.route}>
              {item.label}
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}
