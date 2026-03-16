import { render } from '@testing-library/react';
import React, { JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CodeItem } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { fetchStaticSubjectFields, getVariableDefinitions } from '@/utils/mock-data';
import VariableDefinitionsServicePage from '.';

// biome-ignore lint/suspicious/noEmptyBlockStatements: <Intentional dummy promise>
const promiseNeverResolves = new Promise(() => {});

vi.mock('@/components/sort-fields', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    SortFields: passthrough('select'),
  };
});

vi.mock('@/components/filters/text-filter', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    TextFilter: passthrough('input'),
  };
});

vi.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Link: passthrough('a'),
    Heading: passthrough('h1'),
    Button: passthrough('button'),
    Spinner: passthrough('ellipse'),
    Card: passthrough('section'),
    Fieldset: passthrough('fieldset'),
    TabsPanel: passthrough('div'),
  };
});

describe('VariableDefinitionsServicePage', () => {
  it('happy path', () => {
    const { baseElement } = render(
      <VariableDefinitionsServicePage
        variablesPromise={new Promise((resolve) => getVariableDefinitions())}
        subjectFieldsPromise={new Promise((resolve) => fetchStaticSubjectFields())}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  it('page renders while waiting for variable definitions', () => {
    const { baseElement } = render(
      <VariableDefinitionsServicePage
        variablesPromise={promiseNeverResolves as Promise<{ data: RenderedView[]; error: Error | null }>}
        subjectFieldsPromise={new Promise(() => fetchStaticSubjectFields())}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toContainHTML('<ellipse aria-label="Laster resultater..." />');
    expect(baseElement).toMatchSnapshot();
  });
  it('page renders while waiting for subject fields', () => {
    const { baseElement } = render(
      <VariableDefinitionsServicePage
        variablesPromise={new Promise(() => getVariableDefinitions())}
        subjectFieldsPromise={promiseNeverResolves as Promise<{ data: CodeItem[]; error: Error | null }>}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toContainHTML('<ellipse aria-label="Laster filtere..." />');
    expect(baseElement).toMatchSnapshot();
  });
});
