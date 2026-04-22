import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import { ExternalLink } from '@/components/external-link';
import { localization } from '@/libs/language';
import styles from './feedback-callout.module.css';

export const FeedbackCallout = () => {
  return (
    <Card className={styles.infoSection}>
      <Heading>Del dine erfaringer!</Heading>
      <Paragraph>
        Vi jobber kontinuerlig med å forbedre dataportalen og du kan hjelpe oss ved å fylle ut{' '}
        <ExternalLink
          linkText={localization.feedBackForm}
          href='https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u'
        />
      </Paragraph>
    </Card>
  );
};
