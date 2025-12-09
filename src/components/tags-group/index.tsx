import { Tag } from '@digdir/designsystemet-react';
import styles from './tags-group.module.css';

export type TagData = Map<string, string>;

const TagsGroup = ({ maxTags, tagData: tagData }: { maxTags: number; tagData: TagData }) => {
  return (
    <ul className={styles.tagsList}>
      {Array.from(tagData.entries())
        .slice(0, maxTags)
        .map((entry) => (
          <li key={entry[0]} style={{ margin: 0 }}>
            <Tag>{entry[1]}</Tag>
          </li>
        ))}
    </ul>
  );
};

export default TagsGroup;
