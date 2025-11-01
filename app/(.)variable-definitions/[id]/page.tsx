'use client'

import { BreadcrumbType } from "@/components/breadcrumbs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from '../../(services)/services.module.css'
import { SearchHitsLayout } from "@/components/search-hits-layout";

export default function VariableDefinition() {
    const params = useParams();
    const id = params.id; 

    console.log({id})
    const [loading, setLoading] = useState(true);

    const [variableDefinition, setVariableDefinition] = useState<string>("");
    const [error, setError] = useState(null);

    console.log(error)
    useEffect(() => {
        if (!id) return;

        const validId = id;
        async function load() {
            try {
                setLoading(true);

                setVariableDefinition("data");
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
        }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!variableDefinition) return <div>Variable definition not found</div>;

    const breadcrumbList = id ? ([
                { text: "variable-defintions", href: '/variable-definitions' },
                { text: "detalj", href: '' }, 
            ] as BreadcrumbType[])
        : [];

    return (
        <SearchHitsLayout
            infoContent={<><h1>Hallo</h1></>}
            filterContent={<><h2>Hallo</h2></>}
            mainContent={<><h2>Hallo</h2></>}
            rightContent={<><h3>Hallo</h3></>}
        >
            <h1>Hallo detalj variabler</h1>
        </SearchHitsLayout>
    )
}