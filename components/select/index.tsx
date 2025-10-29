'use client';

import { NativeSelect, NativeSelectProps } from '@digdir/designsystemet-react';
import styles from './select.module.css';

export type SelectOption = {
    label: string;
    value: string;
};

export const Select = (props: NativeSelectProps) => {
    return (
        <div className={styles.select}>
            <NativeSelect {...props} />
        </div>
    );
};