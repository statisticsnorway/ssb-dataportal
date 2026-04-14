import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { localization } from '@/libs/language';
import { getContactEmailAddress } from '@/utils/userAgent';
import { Footer } from '.';

describe('Footer', () => {
  it('should render successfully', () => {
    process.env.CONTACT_EMAIL_ADDRESS = 'metadata@ssb.no';
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/Dataportalen er under utvikling/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: localization.feedBackForm })).toHaveAttribute(
      'href',
      'https://forms.office.com/Pages/ResponsePage.aspx?id=knAhx0CyHU69YfqXupdcvG8mQNraR5ZAu3es4-se84xUN0VFME5BSVFSUTZDRUZCTzNTVUlFTDlUNC4u',
    );
    expect(screen.getByRole('link', { name: getContactEmailAddress() })).toHaveAttribute(
      'href',
      `mailto:${getContactEmailAddress()}`,
    );
  });
});
