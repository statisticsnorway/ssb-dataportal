import { Button } from '@digdir/designsystemet-react';
import { useState } from 'react';
import styles from './checkbox-tree.module.css';
import React from 'react';
import { CheckboxGroupFilter } from './checkboxGroupFilter';

export interface TreeNode {
    value: string;
    label: string;
    children?: TreeNode[];
}

interface Props {
    filters: TreeNode[];
    filterHeading: string;
    selectedItems: string[];
    onFilterChange: (selected: string[]) => void;
}

const CheckboxFilter: React.FC<Props> = ({ filters, filterHeading, selectedItems, onFilterChange }) => {
    const [isOpen, setOpen] = useState(true);

    const handleChange = (newSelected: string[]) => {
        onFilterChange?.(newSelected);
    };

    return (
        <div className={styles.searchFilter}>
            <Button
                fullWidth={true}
                className={styles.checkboxButton}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls='filter-content'
            >
                {filterHeading}
            </Button>
            {isOpen && (
                <div id='filter-content'>
                    <CheckboxGroupFilter
                        items={filters}
                        value={(selectedItems ?? []).map(String)}
                        onChange={handleChange}
                    />
                </div>
            )}
        </div>
    );
};

export {CheckboxFilter};