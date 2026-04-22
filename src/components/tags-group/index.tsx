import { Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import { localization } from '@/libs/language';
import styles from './tags-group.module.css';

interface TagsGroupProps {
  maxTags: number;
  tagData: TagData;
}

export type TagData = Map<string, string>;

/**
 * TagsGroup component displays a list of tags with optional close buttons.
 *
 * @param maxTags - Maximum number of tags to display.
 * @param tagData - Map of tag keys and their corresponding labels.
 *
 * @returns An unordered list (<ul>) of tags or null if tagData is empty.
 */
const TagsGroup = ({ maxTags, tagData }: TagsGroupProps) => {
  const tagsArray = useMemo(() => Array.from(tagData.entries()).slice(0, maxTags), [tagData, maxTags]);

  // Only render the list if there are tags to avoid whitespace
  if (!tagsArray.length) return null;

  return (
    <ul className={styles.tagsList}>
      {tagsArray.map(([key, label]) => (
        <li key={key}>
          <Tag aria-label={localization.subjectArea}>{label}</Tag>
        </li>
      ))}
    </ul>
  );
};

export { TagsGroup };
