'use client'

import { SearchField } from '@/components/search-field';
import styles from './search-page.module.css';
import { Tabs } from "@digdir/designsystemet-react";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";


interface SearchPageProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSearch?: (value: string) => void;
    children: React.ReactNode;
    classificationFamilies: string[]
    variableDefinitions: string[]
    classifications: string[]
}


const SearchPage: React.FC<SearchPageProps> = ({
    placeholder = 'Søk...',
    value = '',
    onSearch = () => {},
    children,
}) => {

    const router = useRouter();
    const pathname = usePathname();

    const [selectedTab, setSelectedTab] = useState('');

    const derivedTab = pathname.includes('/classifications')
        ? 'klassTab'
        : pathname.includes('/variable-definitions')
        ? 'vardefTab'
        : '';

    useEffect(() => {
        if (selectedTab !== derivedTab) {
            setSelectedTab(derivedTab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [derivedTab]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value)
        if (value === 'klassTab') router.push('/classifications');
        else if (value === 'vardefTab') router.push('/variable-definitions');
    };

    const searchFieldOptions = [
        { label: 'Kortnavn', value: 'shortName' },
    ];

    useEffect(() => {
        console.log(selectedTab)
    }, [selectedTab])

    return (
            <Tabs value={selectedTab} className={styles.tabsContainer} data-color='brand1' onChange={handleTabChange}>
                <section className={styles.searchPageWrapper}>
                    <div className={`${styles.searchFieldContent} container`}>
                        <SearchField
                            className={styles.searchField}
                            options={searchFieldOptions}
                            optionValue="shortName"
                            placeholder={placeholder}
                            value={value}
                            onSearch={onSearch}
                        />
                    </div>
                    <div className={`${styles.tabsNavigationContainer} container`}>
                        <Tabs.List className={styles.tabsNavigation}>
                            <Tabs.Tab value='vardefTab' className={styles.tab}>Variabeldefinisjoner</Tabs.Tab>
                            <Tabs.Tab value='klassTab' className={styles.tab}>Klassifikasjoner</Tabs.Tab>
                        </Tabs.List>
                    </div>
                </section>
                <div className={styles.tabsContentContainer}>
                    <Tabs.Content value={selectedTab} className={styles.tabsContent}>
                            {children}
                    </Tabs.Content>
                </div>
            </Tabs>
    )

};

export default SearchPage;