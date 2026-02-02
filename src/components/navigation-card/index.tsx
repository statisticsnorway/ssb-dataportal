import { Card, Heading, Link } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './navigationCard.module.css';

interface NavigationCardProps {
  title: string;
  href: string;
  icon?: ReactNode;
}
// TODO(cbi): Check header rank
const NavigationCard = ({ title, icon, href }: NavigationCardProps) => {
  return (
    <Card className={styles.navigationCard}>
      <div className={styles.icon}>{icon}</div>
      <Heading level={2} className={styles.navigationHeading}>
        <Link className={styles.linkService} href={href}>
          {title}
        </Link>
      </Heading>
    </Card>
  );
};

export { NavigationCard };
