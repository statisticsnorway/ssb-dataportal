'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function useSearchTabs() {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedTab, setSelectedTab] = useState('');

    const tabChangedByUser = useRef(false);

    const handleTabChange = (value: string) => {
        tabChangedByUser.current = true;
        setSelectedTab(value);

        if (value === 'klassTab') router.push('/classifications');
            else if (value === 'vardefTab') router.push('/variable-definitions');
    };

    useEffect(() => {
        if (tabChangedByUser.current) {
            tabChangedByUser.current = false;
            return;
        }

        const newTab = getTabFromPath(pathname);
        if (newTab !== selectedTab) {
            setSelectedTab(newTab);
        }
    }, [pathname, selectedTab]);


    const getTabFromPath = (pathname: string) => {
        if (pathname.includes('/classifications')) return 'klassTab';
        if (pathname.includes('/variable-definitions')) return 'vardefTab';
        return '';
    };

    return { selectedTab, handleTabChange };
}
