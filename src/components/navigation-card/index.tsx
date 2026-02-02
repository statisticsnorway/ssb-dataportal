import { Card, CardBlock, Heading, Link } from '@digdir/designsystemet-react';
import { ReactNode } from 'react';
import styles from './navigationCard.module.css';

interface NavigationCardProps {
  title: string;
  href: string;
  icon?: ReactNode;
}
const NavigationCard = ({ title, icon, href }: NavigationCardProps) => {
  return (
    <Card className={styles.navigationCard}>
      <CardBlock>{icon}</CardBlock>
      <CardBlock>
        <Heading className={styles.navigationHeading}>
          <Link className={styles.linkService} href={href}>
            {title}
          </Link>
        </Heading>
      </CardBlock>
    </Card>
  );
};

export { NavigationCard };
