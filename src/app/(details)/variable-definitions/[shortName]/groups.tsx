import { Paragraph } from '@digdir/designsystemet-react';
import { ApiDocLink } from '@/components/link-components/apiDocLink';
import { EmailLink } from '@/components/link-components/emailLink';
import { ExternalLink } from '@/components/link-components/externalLink';
import { CopyTag } from '@/components/tag-components/short-name-tag';
import { TagData, TagsGroup } from '@/components/tag-components/tags-group';
import { KlassReference } from '@/libs/data-access/variable-definitions/internal';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { localization } from '@/libs/language';
import { Item } from '@/types/item';
import { areFieldsDefinedAndNonNull, formatDate, yesNo } from '@/utils/functions';
import styles from './variable-details-page.module.css';

/**
 * ------------------------------
 * Audit / Created & Edited Items
 * ------------------------------
 */
export const createdAndEditedItems = (v: RenderedView, isAuthenticated: boolean): Item[] => {
  const publicItems: Item[] = [
    { label: `${localization.editing.updated} ${localization.on}`, value: formatDate(v.last_updated_at) },
  ];
  const internalItems: Item[] = [
    {
      label: localization.variableDefinition.owner,
      value: <OwnerDetails variable={v} />,
    },
    {
      label: `${localization.editing.updated} ${localization.by}`,
      value: <EmailLink email={v.last_updated_by} />,
    },
    { label: `${localization.editing.created} ${localization.on}`, value: formatDate(v.created_at) },
    { label: `${localization.editing.created} ${localization.by}`, value: <EmailLink email={v.created_by} /> },
  ];
  return isAuthenticated ? [...publicItems, ...internalItems] : publicItems;
};

/**
 * ------------------------------
 * Owner details
 * ------------------------------
 */
export const OwnerDetails = ({ variable }: { variable: RenderedView }) => {
  const fields = [
    {
      label: localization.owner.daplaTeam.toUpperCase(),
      value: variable?.owner?.team,
    },
    {
      label: localization.owner.groups.toUpperCase(),
      value: variable?.owner?.groups.join(','),
    },
  ];
  return (
    <div className={styles.owner}>
      {fields.map((field) => (
        <Paragraph key={field.label}>
          <span className={styles.ownerLabel}>{field.label}</span>
          <span>:</span>
          <span className={styles.ownerValue}>{field.value}</span>
        </Paragraph>
      ))}
    </div>
  );
};

/**
 * ------------------------------
 * KlassReference -> TagData
 * ------------------------------
 */
const buildItemMaps = (items: KlassReference[]): TagData => {
  return new Map(
    items.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => [ref.title, ref.title]),
  );
};

/**
 * ------------------------------
 * About variable
 * ------------------------------
 */
export const mapAboutVariableItems = (v: RenderedView, isAuthenticated: boolean, apiDocsUrl: string): Item[] => [
  {
    label: localization.unitTypes,
    value: (
      <>
        <TagsGroup tagData={buildItemMaps(v.unit_types)} />
      </>
    ),
    popover: true,
  },
  {
    label: localization.subjectFields,
    value: <TagsGroup tagData={buildItemMaps(v.subject_fields)} />,
  },
  { label: localization.variableDefinition.validFrom, value: formatDate(v.valid_from) },
  ...(v.valid_until
    ? [
        {
          label: localization.variableDefinition.validTo,
          value: formatDate(v.valid_until),
        } satisfies Item,
      ]
    : []),
  {
    label: localization.variableDefinition.documentation,
    value: <ApiDocLink href={apiDocsUrl} />,
  },
  ...(v.classification_uri
    ? [
        {
          label: localization.classification.label,
          value: <ExternalLink href={v.classification_uri} linkText={v.classification_uri} />,
        } satisfies Item,
      ]
    : []),
  {
    label: isAuthenticated
      ? localization.variableDefinition.internalPersonalData
      : localization.variableDefinition.externalPersonalData,
    value: yesNo(v.contains_special_categories_of_personal_data),
  },
  ...(isAuthenticated
    ? [
        {
          label: localization.variableDefinition.id,
          value: <CopyTag text={v.id} copyType='id' />,
        } satisfies Item,
      ]
    : []),
];

/**
 * ------------------------------
 * Contact
 * ------------------------------
 */
export const mapContactItems = (v: RenderedView, isAuthenticated: boolean): Item[] => [
  v.contact?.email
    ? {
        label: localization.variableDefinition.mail,
        value: <EmailLink email={v.contact?.email} />,
      }
    : { label: localization.contact.label, value: v.contact?.title },
  ...createdAndEditedItems(v, isAuthenticated),
];
