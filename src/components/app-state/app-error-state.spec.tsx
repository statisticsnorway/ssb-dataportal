import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppErrorState } from '@/components/app-state/app-error-state';

describe('AppErrorState', () => {
  it('default text rendering', () => {
    render(<AppErrorState />);
    expect(screen.getByRole('heading', { name: 'Vi har tekniske problemer' })).toBeInTheDocument();
    expect(screen.getByText('Dette skyldes ikke noe du gjorde. Vent litt og prøv igjen.')).toBeInTheDocument();
    expect(screen.getByText('Du kan prøve å:')).toBeInTheDocument();
    expect(screen.getByText(/vente litt og laste siden på nytt/i)).toBeInTheDocument();
    expect(screen.getByText(/gå tilbake til forrige side/i)).toBeInTheDocument();
    expect(screen.getByText(/gå til forsiden/i, { selector: 'li' })).toBeInTheDocument();
  });

  it('render default home link', () => {
    render(<AppErrorState />);
    const homelink = screen.getByRole('link', { name: 'Gå til forsiden' });
    expect(homelink).toHaveAttribute('href', '/');
  });

  it('render retry button and calls onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<AppErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'Last siden på nytt' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('render back link', () => {
    render(<AppErrorState backHref='/forrige-side' />);
    const backLink = screen.getByRole('link', { name: 'Gå tilbake' });
    expect(backLink).toHaveAttribute('href', '/forrige-side');
  });

  it('render status- and reference-code', () => {
    render(<AppErrorState statusCode='500' referenceCode='abc123' />);
    expect(screen.getByText('Feilkode: 500')).toBeInTheDocument();
    expect(screen.getByText('Referanse: abc123')).toBeInTheDocument();
  });

  it('render support link', () => {
    render(<AppErrorState supportHref='https://support.example.com' />);
    const supportLink = screen.getByRole('link', { name: 'kontakte oss' });
    expect(supportLink).toHaveAttribute('href', 'https://support.example.com');
    expect(supportLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(supportLink).toHaveAttribute('target', '_blank');
  });

  it('render provided homeRef', () => {
    render(<AppErrorState homeHref='/another-home' />);
    const homeLink = screen.getByRole('link', { name: 'Gå til forsiden' });
    expect(homeLink).toHaveAttribute('href', '/another-home');
  });
});
