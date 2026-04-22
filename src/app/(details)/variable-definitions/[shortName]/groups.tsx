import { Paragraph } from '@digdir/designsystemet-react';
import { ApiDocLink } from '@/components/footer/authApiLink';
import { EmailLink } from '@/components/link-components/emailLink';
import { DetailsTag } from '@/components/tag-components';
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
          <span>{field.label}</span>
          <span>:</span>
          <span>{field.value}</span>
        </Paragraph>
      ))}
    </div>
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
      <DetailsTag
        popover={true}
        text={v.unit_types.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title)}
      />
    ),
  },
  {
    label: localization.subjectFields,
    value: (
      <DetailsTag
        text={v.subject_fields.filter((ref) => areFieldsDefinedAndNonNull(ref, ['title'])).map((ref) => ref.title)}
      />
    ),
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
          value: v.classification_uri ?? null,
          display: localization.classification.view,
        } satisfies Item,
      ]
    : []),
  {
    label: isAuthenticated
      ? localization.variableDefinition.internalPersonalData
      : localization.variableDefinition.externalPersonalData,
    value: yesNo(v.contains_special_categories_of_personal_data),
  },
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
  {
    label: localization.variableDefinition.owner,
    value: <OwnerDetails variable={v} />,
  },
];
