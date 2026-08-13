import { ClassificationResource } from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import { ClassificationType, getClassificationTypeFromString } from '@/types/classification';
import { SubscribeStatus } from '@/types/subscription';

const ALL_KNOWN_PREFIXES = [
  // nb / nn
  'Kodeliste for',
  'Standard for',
  // en
  'Codelist for',
  'Classification of',
];

/**
 * Removes known classification prefixes from a title and capitalizes first letter.
 */
export const stripTitlePrefix = (name?: string) => {
  const matchedPrefix = ALL_KNOWN_PREFIXES.find((prefix) =>
    name?.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()),
  );
  const stripped = (matchedPrefix ? name?.slice(matchedPrefix.length) : name)?.trim() ?? '';

  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
};

export function normalizeClassificationTypes(classification: ClassificationResource): ClassificationResource {
  classification.classificationType = getClassificationTypeFromString(classification.classificationType);
  return classification;
}

/**
 * Returns a display label for a classification type.
 *
 * @param it - The classification type.
 * @returns The label to display for the classification type.
 */
export const getLabelForClassificationType = (it: ClassificationType | undefined) => {
  switch (it) {
    case ClassificationType.Classification:
      return localization.classification.standard;
    case ClassificationType.Codelist:
      return localization.classification.codelist;
    default:
      return it;
  }
};

/**
 * Returns a localized message for a subscription status code.
 *
 * @param code - The subscription status code.
 * @returns The localized message corresponding to the status code.
 */
export const messageByCode = (code: SubscribeStatus) => {
  switch (code) {
    case SubscribeStatus.Exists:
      return localization.classification.subscribeMessageAlready;
    case SubscribeStatus.Created:
      return localization.classification.subscribeMessageSuccess;
    case SubscribeStatus.Error:
      return localization.classification.subscribeMessageError;
    case SubscribeStatus.InvalidEmail:
      return localization.classification.subscribeMessageInvalidEmail;
  }
};
