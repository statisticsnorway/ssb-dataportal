import { Tag } from '@digdir/designsystemet-react';
import { toArray } from 'lodash';
import React from 'react';
import styles from './tags-group.module.css';

export type TagData = {
  key: string;
  title: string;
};

export type TagsData = Set<TagData>;

const TagsGroupComponent = ({ maxTags, tagsData }: { maxTags: number; tagsData: TagsData }) => {
  Array.from(tagsData).forEach((value) => console.log(value));
  return (
    <ul className={styles.tagsList}>
      {Array.from(tagsData)
        .slice(0, maxTags)
        .map((entry: TagData) => (
          <li key={entry.key} style={{ margin: 0 }}>
            <Tag>{entry.title}</Tag>
          </li>
        ))}
    </ul>
  );
};

const TagsGroup = React.memo(TagsGroupComponent);
TagsGroup.displayName = 'TagsGroup';

export { TagsGroup };
