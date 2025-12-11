'use client';
import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { TextField } from '.';

jest.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: string) =>
    ({ children, ...props }: { children?: ReactNode } & Record<string, any>) =>
      React.createElement(tag, props, children);

  return {
    Label: passthrough('label'),
    Paragraph: passthrough('p'),
    Link: passthrough('a'),
  };
});

describe('TextField', () => {
  it('renders label and value correctly', () => {
    render(
      <dl>
        <TextField label='Definisjon' value='This is a definition' />
      </dl>,
    );

    expect(screen.getByText('Definisjon')).toBeInTheDocument();
    expect(screen.getByText('This is a definition')).toBeInTheDocument();
  });

  it('renders long text content', () => {
    const longText = 'This is a very long definition that should be displayed as paragraph text.';
    render(
      <dl>
        <TextField label='Kommentar' value={longText} />
      </dl>,
    );

    const element = screen.getByText(longText);
    expect(element).toBeInTheDocument();
    expect(['P', 'SPAN']).toContain(element.tagName);
  });

  it('renders URL as text (mock does not auto-link)', () => {
    const linkText = 'www.example.com';
    render(
      <dl>
        <TextField label='Kommentar' value={linkText} />
      </dl>,
    );

    const urlElement = screen.getByText(linkText);
    expect(urlElement).toBeInTheDocument();
  });

  it('renders tag label but no text (current implementation)', () => {
    const tagText = 'Tag text';
    render(
      <dl>
        <TextField label='Tag' value={tagText} type='tags' />
      </dl>,
    );

    expect(screen.getByText('Tag')).toBeInTheDocument();
    const ddElement = screen.getByText('Tag').nextElementSibling;
    expect(ddElement?.textContent).toBe('');
  });
});
