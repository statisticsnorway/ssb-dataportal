'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useSearchTabs() {
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
        setSelectedTab(value);
        if (value === 'klassTab') router.push('/classifications');
        else if (value === 'vardefTab') router.push('/variable-definitions');
    };

    return { selectedTab, handleTabChange };
}
