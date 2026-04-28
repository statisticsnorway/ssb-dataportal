import { Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import styles from './tags-group.module.css';

interface TagsGroupProps {
  maxTags?: number;
  tagData: TagData;
  ariaLabel?: string;
}

export type TagData = Map<string, string>;

/**
 * TagsGroup component displays a list of tags.
 *
 * @param maxTags - Maximum number of tags to display.
 * @param tagData - Map of tag keys and their corresponding labels.
 *
 * @returns An unordered list (<ul>) of tags or null if tagData is empty.
 */
const TagsGroup = ({ maxTags, tagData, ariaLabel }: TagsGroupProps) => {
  const tagsArray = useMemo(() => {
    const entries = Array.from(tagData.entries());

    return maxTags !== undefined ? entries.slice(0, maxTags) : entries;
  }, [tagData, maxTags]);

  // Only render the list if there are tags to avoid whitespace
  if (!tagsArray.length) return null;

  return (
    <ul className={styles.tagsList}>
      {tagsArray.map(([key, label]) => (
        <li key={key}>
          <Tag aria-label={ariaLabel}>{label}</Tag>
        </li>
      ))}
    </ul>
  );
};

export { TagsGroup };
