'use client';
import { render, screen } from '@testing-library/react';
import React, { JSX } from 'react';
import { CoreInformation } from './core-information';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';

jest.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);

  return {
    Label: passthrough('label'),
    Paragraph: passthrough('p'),
    Heading: passthrough('h2'),
  };
});

const mockVariableDefinition: CompleteResponse = {
  id: 'test-id',
  patchId: 1,
  name: { nb: 'Test Variable', en: 'Test Variable' },
  shortName: 'test_var',
  definition: { nb: 'This is a test definition', en: 'This is a test definition' },
  unitTypes: [],
  subjectFields: [],
  containsSpecialCategoriesOfPersonalData: false,
  validFrom: new Date('2020-01-01'),
  owner: { team: 'test-team', groups: ['group1'] },
  contact: { title: { nb: 'Contact Title' }, email: 'test@example.com' },
  createdAt: new Date('2020-01-01'),
  createdBy: 'test-user',
  lastUpdatedAt: new Date('2020-01-01'),
  lastUpdatedBy: 'test-user',
};

describe('CoreInformation', () => {
  it('renders definition field', () => {
    render(<CoreInformation data={mockVariableDefinition} />);
    
    expect(screen.getByText('Definisjon')).toBeInTheDocument();
    expect(screen.getByText('This is a test definition')).toBeInTheDocument();
  });

  it('renders comment field when comment exists', () => {
    const dataWithComment = {
      ...mockVariableDefinition,
      comment: { nb: 'This is a comment' },
    };
    
    render(<CoreInformation data={dataWithComment} />);
    
    expect(screen.getByText('Kommentar')).toBeInTheDocument();
    expect(screen.getByText('This is a comment')).toBeInTheDocument();
  });

  it('does not render comment field when comment is null', () => {
    render(<CoreInformation data={mockVariableDefinition} />);
    
    expect(screen.queryByText('Kommentar')).not.toBeInTheDocument();
  });

  it('does not render comment field when comment.nb is empty', () => {
    const dataWithEmptyComment = {
      ...mockVariableDefinition,
      comment: { nb: '' },
    };
    
    render(<CoreInformation data={dataWithEmptyComment} />);
    
    expect(screen.queryByText('Kommentar')).not.toBeInTheDocument();
  });
});
