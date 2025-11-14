'use server' 
import SearchPage from '@/components/search-page/searchPage';
import styles from './services.module.css'

import { ReactNode } from 'react';
export default async function TabsLayout({ children }: { children: ReactNode }) {
    //const classificationFamilies: string[] = ["Three", "Four"]
    //const classifications: string[] = ["One", "Two"]
    //const variableDefinitions: string[] = ["Six", "Seven"]

    return (
        <div className={styles.metadataContainer}>
            <SearchPage
                    //classificationFamilies={classificationFamilies}
                    //classifications={classifications}
                    //variableDefinitions={variableDefinitions}
            >
                {children}
            </SearchPage>
        </div>
    );
}