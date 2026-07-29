'use client';

import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useAuthContext } from '@/app/authContext';
import { localization } from '@/libs/language';
import { ExternalLink } from '../link-components/externalLink';

export const FeedbackCallout = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated ? (
        <section className='containerBox'>
          <Card role='complementary'>
            <Heading level={3} className='infoHeadingSecondary'>
              {localization.info.feedbackTitle}
            </Heading>
            <Paragraph>
              {localization.info.feedbackBody}{' '}
              <ExternalLink
                linkText={localization.info.feedbackForm}
                href='https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u'
              />
            </Paragraph>
          </Card>
        </section>
      ) : null}
    </>
  );
};
