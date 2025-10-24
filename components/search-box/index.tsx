'use client'

import { Search } from '@digdir/designsystemet-react';
import styles from './search-box.module.css';
import { Tabs } from "@digdir/designsystemet-react";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { SearchField } from '../search-field';


interface SearchBoxProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSearch?: (value: string) => void;
    children: React.ReactNode;
    classificationFamilies: string[]
    variableDefinitions: string[]
    classifications: string[]
}


const SearchBox: React.FC<SearchBoxProps> = ({
    placeholder = 'Søk...',
    value = '',
    onSearch = () => {},
    children,
    classificationFamilies,
    variableDefinitions,
    classifications,
}) => {

    const router = useRouter();
    const pathname = usePathname();


    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        if (pathname.includes('/classifications')) {
            setSelectedTab('klassTab');
        } else if (pathname.includes('/variable-definitions')) {
            setSelectedTab('vardefTab');
        } else {
            setSelectedTab('');
        }
    }, [pathname]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value)
        if (value === 'klassTab') router.push('/classifications');
        else if (value === 'vardefTab') router.push('/variable-definitions');
    };

    const dummySearchFieldOptions = [
        { label: 'Kortnavn', value: 'shortName' },
];

    useEffect(() => {
        console.log(selectedTab)
    }, [selectedTab])

    return (
            <Tabs value={selectedTab} className={styles.tabsContainer} data-color='brand1' onChange={handleTabChange}>
                <section className={styles.searchBoxWrapper}>
                    <div className={styles.searchFieldContent}>
                        <SearchField
                            className={styles.searchField}
                            options={dummySearchFieldOptions}
                            optionValue="shortName"
                            placeholder={placeholder}
                            value={value}
                            onSearch={onSearch}
                        />
                    </div>
                    <div className="container">
                        <Tabs.List>
                            <Tabs.Tab value='vardefTab' className={styles.tab}>Variabeldefinisjoner</Tabs.Tab>
                            <Tabs.Tab value='klassTab' className={styles.tab}>Klassifikasjoner</Tabs.Tab>
                        </Tabs.List>
                    </div>
                </section>
                <div className={styles.tabsContainer}>
                    <Tabs.Content value={selectedTab} className={styles.tabsContent}>
                            {children}
                    </Tabs.Content>
                </div>
            </Tabs>
    )

};

export default SearchBox;
