import { Button, Dropdown, Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
//import { FILTER_HEADING } from '@/utils/constants';
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
  filterGroups?: FilterGroup[];
}

interface TagWithCloseButtonProps {
  onClose?: (key: string) => void;
  label: string;
  id: string;
}

export type TagData = Map<string, string>;

/**
 * Tag component with close button
 */
const TagWithCloseButton: React.FC<TagWithCloseButtonProps> = ({ label, id, onClose }) => {
  return (
    <Tag variant={'outline'} data-size='md' data-color='accent' className={styles.tagWithButton}>
      {label}
      {onClose && (
        <Button data-size={'md'} className={styles.closeButton} onClick={() => onClose(id)}>
          x
        </Button>
      )}
    </Tag>
  );
};

/**
 * TagsGroup component displays a list of tags with optional close buttons.
 *
 * @param maxTags - Maximum number of tags to display.
 * @param tagData - Map of tag keys and their corresponding labels.
 * @param closeButton=false - Whether each tag should have a close button.
 * @param onClose - Callback triggered when a tag's close button is clicked.
 * @param onClearAll - Optional "Remove All" button configuration.
 *
 * @returns An unordered list (<ul>) of tags, optionally with close buttons and a "Remove All" button.
 */
const TagsGroup = ({ maxTags, tagData, closeButton = false, onClose, onClearAll, filterGroups }: TagsGroupProps) => {
  const tagsArray = useMemo(() => Array.from(tagData.entries()).slice(0, maxTags), [tagData, maxTags]);

  console.log({
    Tag,
    TagWithCloseButton,
    Dropdown,
    DropdownListItem: Dropdown?.listItem,
  });
  return (
    <div className={styles.tagsWithHeading}>
      <Dropdown.TriggerContext>
        <Dropdown.Trigger>Filter</Dropdown.Trigger>
        <Dropdown placement='bottom-start' autoPlacement={false}>
          <Dropdown.List>
            {(filterGroups || []).map((group) =>
              group.filters.map((item) => (
                <Dropdown.Item key={item.value}>
                  <Dropdown.Button>{item.label}</Dropdown.Button>
                </Dropdown.Item>
              )),
            )}
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>
      {/*{closeButton ? (
        <Heading level={3} data-size='sm'>
          {FILTER_HEADING}
        </Heading>
      ) : null}*/}
      <ul className={styles.tagsList}>
        {/* Remove All button if used with closeButton and list */}
        {closeButton && tagsArray.length > 1 && onClearAll && (
          <li key='remove-all' style={{ margin: 0 }}>
            <Tag
              variant='outline'
              data-color={'accent'}
              className={styles.closeAllTag}
              data-size='md'
              style={{ borderRadius: '5px' }}
            >
              {onClearAll.text}
              <Button className={styles.closeAllButton} onClick={onClearAll.action}>
                x
              </Button>
            </Tag>
          </li>
        )}
        {tagsArray.map(([key, label]) => (
          <li key={key} style={{ margin: 0 }}>
            {closeButton ? (
              <TagWithCloseButton label={label} id={key} onClose={() => onClose?.(key)} />
            ) : (
              <Tag>{label}</Tag>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export { TagsGroup, TagWithCloseButton };
