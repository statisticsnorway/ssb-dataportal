import {useState, useCallback} from 'react';

export function useClipboard(timeout = 2500) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), timeout);
            } catch (err) {
                console.error('Kopiering mislyktes', err);
            }
        }, [timeout]
    );
    return {copied, copyToClipboard};
}