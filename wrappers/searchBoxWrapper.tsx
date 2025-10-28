'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SearchPage from '@/components/search-page';

interface SearchBoxWrapperProps {
    children?: React.ReactNode;
    classificationFamilies: string[];
    classifications: string[];
    variableDefinitions: string[];
}

export default function SearchBoxWrapper({
    children,
}: SearchBoxWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        if (pathname.includes('/classifications')) setSelectedTab('klassTab');
        else if (pathname.includes('/variable-definitions')) setSelectedTab('vardefTab');
        else setSelectedTab('');
    }, [pathname]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value);
        if (value === 'klassTab') router.push('/classifications');
        else if (value === 'vardefTab') router.push('/variable-definitions');
    };

    return (
        <SearchPage
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            >
            {children}
        </SearchPage>
    );
}
