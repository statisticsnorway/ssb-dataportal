import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '@/app/authContext';
import { getContactEmailAddress } from '@/utils/userAgent';
import { Footer } from '.';

describe('Footer', () => {
  it('should render successfully', () => {
    process.env.CONTACT_EMAIL_ADDRESS = 'informasjon@ssb.no';
    render(
      <AuthProvider isAuthenticated={false}>
        <Footer />
      </AuthProvider>,
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: getContactEmailAddress() })).toHaveAttribute(
      'href',
      `mailto:${getContactEmailAddress()}`,
    );
  });
});
