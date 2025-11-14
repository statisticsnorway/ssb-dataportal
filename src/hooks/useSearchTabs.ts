'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useSearchTabs() {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedTab, setSelectedTab] = useState('');
    const getTabFromPath = (pathname: string) => {
        if (pathname.includes('/classifications')) return 'klassTab';
        if (pathname.includes('/variable-definitions')) return 'vardefTab';
        return '';
    };

    useEffect(() => {
        const newTab = getTabFromPath(pathname);
        if (newTab !== selectedTab) {
            setSelectedTab(newTab);
        }
    }, [pathname, selectedTab]);

    const handleTabChange = (value: string) => {
        setSelectedTab(value);
        if (value === 'klassTab') router.push('/classifications');
        else if (value === 'vardefTab') router.push('/variable-definitions');
    };

    return { selectedTab, handleTabChange };
}
