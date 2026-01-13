'use client';

import  {Button} from '@digdir/designsystemet-react';
import {useMemo, useState} from "react";
import styles from "@/app/(services)/variable-definitions/[id]/variable-details-page.module.css";

type Props = {
    title?: string;
    code: string;
    copyLabel?: string;
    copiedLabel?: string;
    className?: string;
};

export function PythonSnippet({
    title='Python',
    code,
    copyLabel='Kopier kode',
    copiedLabel='Kopiert!',
    className,
}: Props) {
    const [copied, setCopied] = useState(false);
    const lines=useMemo(()=> code.replace(/\n$/,'').split('\n'),[code]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Kopiering mislyktes', err);
        }
    };

    return (
        <section>
            <div>
                <span>Her skal tittel i krøllparentes</span>
                <Button
                    title='Kopier ID'
                    className={styles.copyId}
                    icon
                    onClick={handleCopy}
                    aria-label={copied ? 'Kopiert' : 'Kopier ID'}
                >
                    {copied ? copiedLabel : copyLabel}
                </Button>
            </div>

            <pre>
                <code>
                    {lines.map((line, i) => (
                        <span key={i}>
                            {line||'\u00A0'}
                        </span>
                    ))}
                </code>
            </pre>
        </section>
    );
}