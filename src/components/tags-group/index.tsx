import { Button, Tag } from '@digdir/designsystemet-react';
import styles from './tags-group.module.css';

interface TagsGroupProps {
  maxTags: number;
  tagData: TagData;
  closeButton?: boolean;
  onClose?: (key: string) => void;
}
export type TagData = Map<string, string>;

const TagWithCloseButton: React.FC<TagWithCloseButtonProps> = ({ label, onClose }) => {
  return (
    <Tag>
      {label}
      {onClose && (
        <Button className={styles.closeButton} size='sm' onClick={onClose} style={{ marginLeft: 4 }}>
          ×
        </Button>
      )}
    </Tag>
  );
};

const TagsGroup = ({ maxTags, tagData, closeButton = false, onClose }: TagsGroupProps) => {
  return (
    <ul className={styles.tagsList}>
      {Array.from(tagData.entries())
        .slice(0, maxTags)
        .map(([key, label]) => (
          <li key={key} style={{ margin: 0 }}>
            {closeButton ? <TagWithCloseButton label={label} onClose={() => onClose?.(key)} /> : <Tag>{label}</Tag>}
          </li>
        ))}
    </ul>
  );
};

export { TagsGroup, TagWithCloseButton };
