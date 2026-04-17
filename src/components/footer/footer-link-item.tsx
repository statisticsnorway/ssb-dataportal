import { ReactNode } from 'react';
import styles from './footer.module.css';

interface FooterLinkItemProps {
  icon: ReactNode;
  children: ReactNode;
}

export const FooterLinkItem = ({ icon, children }: FooterLinkItemProps) => {
  return (
    <div className={styles.footerLinkItem}>
      {icon}
      {children}
    </div>
  );
};
