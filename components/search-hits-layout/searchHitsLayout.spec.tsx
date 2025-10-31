import React from 'react';
import { render } from '@testing-library/react';
import { SearchHitsLayout } from './searchHitsLayout';
import {  screen } from '@testing-library/react';

describe('SearchHitsLayout', () => {
    it('renders the infoContent, mainContent, filterContent, and children correctly', () => {
        render(
            <SearchHitsLayout
                infoContent={<div data-testid="info">Info Section</div>}
                mainContent={<div data-testid="main">Main Section</div>}
                filterContent={<div data-testid="filter">Filter Section</div>}
            >
                <div data-testid="children">Child Content</div>
            </SearchHitsLayout>
        );

        // check info section
        expect(screen.getByTestId('info')).toBeInTheDocument();
        expect(screen.getByTestId('info')).toHaveTextContent('Info Section');

        // check main section
        expect(screen.getByTestId('main')).toBeInTheDocument();
        expect(screen.getByTestId('main')).toHaveTextContent('Main Section');

        // check filter section
        expect(screen.getByTestId('filter')).toBeInTheDocument();
        expect(screen.getByTestId('filter')).toHaveTextContent('Filter Section');

        // check children
        expect(screen.getByTestId('children')).toBeInTheDocument();
        expect(screen.getByTestId('children')).toHaveTextContent('Child Content');
    });

    it('renders empty sections when no props are provided', () => {
        render(<SearchHitsLayout />);
    
        expect(screen.queryByText(/./)).not.toBeInTheDocument(); // nothing rendered inside sections
    });
});
