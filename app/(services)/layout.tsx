'use server' 
import SearchBox from '@/components/search-box';
import styles from './services.module.css'

import { ReactNode } from 'react';
export default async function TabsLayout({ children }: { children: ReactNode }) {
    const classificationFamilies: string[] = ["Three", "Four"]
    const classifications: string[] = ["One", "Two"]
    const variableDefinitions: string[] = ["Six", "Seven"]

    return (
        <div className={styles.metadataContainer}>
            <SearchBox
                classificationFamilies={classificationFamilies}
                classifications={classifications}
                variableDefinitions={variableDefinitions}
            >
                {children}
            </SearchBox>
        </div>
    );
}