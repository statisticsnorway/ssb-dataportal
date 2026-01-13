'use client';

import  {Button} from '@digdir/designsystemet-react';
import {useMemo} from "react";
import styles from './python-snippet.module.css';
import { ClipboardCheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
import {useClipboard} from "@/hooks/useClipboard";

type Props = {
    title?: string;
    code: string;
    copyLabel?: string;
    copiedLabel?: string;
    className?: string;
};

export function CodeSnippet({
    title='Python kodeeksempel',
    code,
    className,
}: Props) {
    const {copied, copyToClipboard} = useClipboard();
    const lines=useMemo(()=> code.replace(/\n$/,'').split('\n'),[code]);

    return (
        <section className={`${styles.snippet} ${className||''}`}>
            <div className={styles.header}>
                <span >{title}</span>
                <Button
                    title='Kopier kode'
                    className="copyButton"
                    icon
                    onClick={()=>copyToClipboard(code)}
                    aria-label={copied ? 'Kopiert' : 'Kopier kode'}
                >
                    {copied ? <ClipboardCheckmarkIcon aria-hidden/> : <ClipboardIcon aria-hidden/>}
                </Button>
            </div>

            <pre className={styles.pre}>
                <code className={styles.code}>
                    {lines.map((line, i) => (
                        <span key={`${i}-${line}`} className={styles.line}>
                            {line||'\u00A0'}
                        </span>
                    ))}
                </code>
            </pre>
        </section>
    );
}