import styles from '../search-box/search-box.module.css'
import { Tabs } from "@digdir/designsystemet-react";
import { SearchField } from '../search-field';
import { SearchFieldOption, TabItem } from '@/types/tabs';


interface SearchPageProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSearch?: (value: string) => void;
    selectedTab: string;
    onTabChange: (value: string) => void;
    children?: React.ReactNode;
}

export const SearchPage: React.FC<SearchPageProps> = ({
    className,
    placeholder = 'Søk...',
    value = '',
    onSearch = () => {},
    selectedTab,
    onTabChange,
    children,
}) => {

    const tabs: TabItem[] = [
        { value: 'vardefTab', label: 'Variabeldefinisjoner' },
        { value: 'klassTab', label: 'Klassifikasjoner' }
    ];

    const searchFieldOptions: SearchFieldOption[] = [
        { label: 'Alle felt', value: 'alleFelt', default: true },
        { label: 'Navn', value: 'name' },
        { label: 'Kortnavn', value: 'shortName' }
    ];
    return (
        <Tabs
            value={selectedTab}
            onChange={onTabChange}
            className={`${styles.tabsContainer} ${className || ''}`}
            data-color="brand1"
        >
        <section className={styles.searchBoxWrapper}>
            <div className={styles.searchFieldContent}>
                <SearchField
                    className={styles.searchField}
                    options={searchFieldOptions}
                    optionValue="alleFelt"
                    placeholder={placeholder}
                    value={value}
                    onSearch={onSearch}
                />
            </div>

            <div className="container">
                <Tabs.List>
                    {tabs.map((tab) => (
                        <Tabs.Tab key={tab.value} value={tab.value} className={styles.tab}>
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </div>
        </section>

        <div className={styles.tabsContainer}>
            <Tabs.Content value={selectedTab} className={styles.tabsContent}>
                {children}
            </Tabs.Content>
        </div>
    </Tabs>
    );
};

export default SearchPage;
