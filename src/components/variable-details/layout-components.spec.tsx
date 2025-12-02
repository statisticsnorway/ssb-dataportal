'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { DetailsPageSection, DetailsPagePanel } from './layout-components';

jest.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Heading: passthrough('h2'),
  };
});

describe('Section', () => {
  it('renders children correctly', () => {
    render(
      <DetailsPageSection>
        <div>Test Content</div>
      </DetailsPageSection>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <DetailsPageSection title="Test Section">
        <div>Content</div>
      </DetailsPageSection>
    );
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    const { container } = render(
      <DetailsPageSection>
        <div>Content</div>
      </DetailsPageSection>
    );
    
    const heading = container.querySelector('h2');
    expect(heading).not.toBeInTheDocument();
  });
});

describe('InfoPanel', () => {
  it('renders children correctly', () => {
    render(
      <DetailsPagePanel>
        <div>Panel Content</div>
      </DetailsPagePanel>
    );
    
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('renders as dl element', () => {
    const { container } = render(
      <DetailsPagePanel>
        <div>Content</div>
      </DetailsPagePanel>
    );
    
    const dl = container.querySelector('dl');
    expect(dl).toBeInTheDocument();
  });

  it('applies two-column grid class when columns=2', () => {
    const { container } = render(
      <DetailsPagePanel columns={2}>
        <div>Content</div>
      </DetailsPagePanel>
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveClass('gridTwoCol');
  });

  it('does not apply grid class when columns=1', () => {
    const { container } = render(
      <DetailsPagePanel columns={1}>
        <div>Content</div>
      </DetailsPagePanel>
    );
    
    const panel = container.firstChild;
    expect(panel).not.toHaveClass('gridTwoCol');
  });
});
