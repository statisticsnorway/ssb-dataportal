import styles from './search-hit.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Url } from 'next/dist/shared/lib/router/router';
import { Tag } from '@digdir/designsystemet-react';
import { localization, getTranslateText as translate } from '@/utils/src';

interface SearchHitProps {
    title: string[] | string;
    rightColumn?: ReactNode;
    content?: ReactNode;
    titleHref?: Url;
    labels?: ReactNode;
    tags?: ReactNode[];
}

const SearchHit = ({ title, content, tags, titleHref, rightColumn, labels }: SearchHitProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.rowSpaceBetween}>
                <div className={styles.titleRow}>
                    <Link href={titleHref ?? ''}>
                        <h2 className={styles.title}>{translate(title) ? translate(title) : localization.concept.noName}</h2>
                    </Link>
                    {tags && tags.length > 0 && (
                        <div>
                            {tags
                                .filter(tag => !!tag)
                                .map((tag, index) => (
                                    <Tag key={index} color="info">
                                        {tag}
                                    </Tag>
                                ))
                            }
                        </div>
                    )}
                </div>
                {rightColumn}
            </div>
            {content}
            {labels}
        </div>
    );
};

export { SearchHit };
