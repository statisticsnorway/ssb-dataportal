import { Button, Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import styles from './tags-group.module.css';

interface TagsGroupProps {
  maxTags: number;
  tagData: TagData;
  closeButton?: boolean;
  onClose?: (key: string) => void;
  onClearAll?: {
    text: string;
    action: () => void;
  };
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

const TagsGroup = ({ maxTags, tagData, closeButton = false, onClose, onClearAll }: TagsGroupProps) => {
  const tagsArray = useMemo(() => Array.from(tagData.entries()).slice(0, maxTags), [tagData, maxTags]);

  return (
    <ul className={styles.tagsList}>
      {/* Remove All button if used with closeButton and list */}
      {closeButton && tagsArray.length > 1 && onClearAll && (
        <li key='remove-all' style={{ margin: 0 }}>
          <Tag>
            <Button size='sm' className={styles.closeAllButton} onClick={onClearAll.action}>
              {onClearAll.text} <span>X</span>
            </Button>
          </Tag>
        </li>
      )}
      {tagsArray.map(([key, label]) => (
        <li key={key} style={{ margin: 0 }}>
          {closeButton ? <TagWithCloseButton label={label} onClose={() => onClose?.(key)} /> : <Tag>{label}</Tag>}
        </li>
      ))}
    </ul>
  );
};
export { TagsGroup, TagWithCloseButton };
