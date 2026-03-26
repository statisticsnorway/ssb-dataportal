import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppErrorState } from '@/components/app-state/app-error-state';
import { localization } from '@/libs/language';

describe('AppErrorState', () => {
  const {
    technicalProblemsTitle,
    technicalProblemsMessage,
    reloadPage,
    goBack,
    goHome,
    helpTitle,
    helpReload,
    helpBack,
    helpHome,
    supportLinkText,
  } = localization.error;

  it('render default text', () => {
    render(<AppErrorState />);
    expect(screen.getByRole('heading', { name: technicalProblemsTitle })).toBeInTheDocument();
    expect(screen.getByText(technicalProblemsMessage)).toBeInTheDocument();
    expect(screen.getByText(helpTitle)).toBeInTheDocument();
    expect(screen.getByText(helpReload)).toBeInTheDocument();
    expect(screen.getByText(helpBack)).toBeInTheDocument();
    expect(screen.getByText(helpHome, { selector: 'li' })).toBeInTheDocument();
  });

  it('renders overridden title', () => {
    render(<AppErrorState title='Custom title' />);
    expect(screen.getByRole('heading', { name: 'Custom title' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: technicalProblemsTitle })).not.toBeInTheDocument();
  });

  it('renders overridden message', () => {
    render(<AppErrorState message='Custom message' />);
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.queryByText(technicalProblemsMessage)).not.toBeInTheDocument();
  });

  it('renders overridden title and message together', () => {
    render(<AppErrorState title='Custom title' message='Custom message' />);
    expect(screen.getByRole('heading', { name: 'Custom title' })).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('render default home link', () => {
    render(<AppErrorState />);
    const homelink = screen.getByRole('link', { name: goHome });
    expect(homelink).toHaveAttribute('href', '/');
  });

  it('render retry button and calls onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<AppErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: reloadPage }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('render back link', () => {
    render(<AppErrorState backHref='/forrige-side' />);
    const backLink = screen.getByRole('link', { name: goBack });
    expect(backLink).toHaveAttribute('href', '/forrige-side');
  });

  it('render status- and reference-code', () => {
    render(<AppErrorState statusCode='500' referenceCode='abc123' />);
    expect(screen.getByText('Feilkode: 500')).toBeInTheDocument();
    expect(screen.getByText('Referanse: abc123')).toBeInTheDocument();
  });

  it('render support link', () => {
    render(<AppErrorState supportHref='https://support.example.com' />);
    const supportLink = screen.getByRole('link', { name: supportLinkText });
    expect(supportLink).toHaveAttribute('href', 'https://support.example.com');
    expect(supportLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(supportLink).toHaveAttribute('target', '_blank');
  });

  it('render provided homeRef', () => {
    render(<AppErrorState homeHref='/another-home' />);
    const homeLink = screen.getByRole('link', { name: goHome });
    expect(homeLink).toHaveAttribute('href', '/another-home');
  });
});
