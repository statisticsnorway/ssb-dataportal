'use client';

import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useAuthContext } from '@/app/authContext';
import { ExternalLink } from '@/components/external-link';
import { localization } from '@/libs/language';
import styles from './feedback-callout.module.css';

export const FeedbackCallout = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated ? (
        <Card role='complementary' className={styles.infoSection}>
          <Heading>{localization.info.feedbackTitle}</Heading>
          <Paragraph>
            {localization.info.feedbackBody}{' '}
            <ExternalLink
              linkText={localization.info.feedBackForm}
              href='https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u'
            />
          </Paragraph>
        </Card>
      ) : null}
    </>
  );
};
