import { ClassificationVersionResource, ClassificationVersionResourceFromJSONTyped } from '@/libs/data-access/klass';
import {
  ClassificationResource,
  ClassificationResourceFromJSONTyped,
} from '@/libs/data-access/klass/models/ClassificationResource';
import { localization } from '@/libs/language/src/localization';
import { ClassificationType } from '@/types/classification';
import { SubscribeStatus } from '@/types/subscription';

/**
 * Removes known classification prefixes from a title and capitalizes first letter.
 */
export const stripTitlePrefix = (name?: string) => {
  const matchedPrefix = [localization.classification.codeListPrefix, localization.classification.standardPrefix].find(
    (prefix) => name?.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()),
  );
  const stripped = (matchedPrefix ? name?.slice(matchedPrefix.length) : name)?.trim() ?? '';

  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
};

/**
 * Check if an object is compatible with type 'ClassificationResource'
 *
 * @param value - object to check
 * @returns true if object is a valid 'ClassificationResource'
 */
function instanceOfClassification(value: object): value is ClassificationResource {
  if (!('id' in value) || value['id'] === undefined) return false;
  if (!('name' in value) || value['name'] === undefined) return false;
  if (!('classificationType' in value) || value['classificationType'] === undefined) return false;
  if (!('lastModified' in value) || value['lastModified'] === undefined) return false;
  if (!('_links' in value)) return false;
  return true;
}

/**
 * Check if an object is compatible with type 'ClassificationVersionResource'
 *
 * @param value - object to check
 * @returns true if object is a valid 'ClassificationVersionResource'
 */
function instanceOfClassificationVersion(value: object): value is ClassificationVersionResource {
  if (!('id' in value) || typeof value['id'] !== 'number') return false;
  if (!('name' in value) || typeof value['name'] !== 'string') return false;
  if (!('validFrom' in value) || typeof value['validFrom'] !== 'string') return false;
  if (!('lastModified' in value) || typeof value['lastModified'] !== 'string') return false;
  if (!('_links' in value) || typeof value['_links'] !== 'object' || value['_links'] === null) return false;
  return true;
}

/**
 * Parse json to valid 'ClassificationResource'
 *
 * @param json
 * @returns ClassificationResource
 */
export function parseClassification(json?: object | null): ClassificationResource {
  if (json == null) {
    throw new Error(`Object is null: ${json}`);
  }
  if (!instanceOfClassification(json)) {
    throw new Error(`Invalid classification: ${json}`);
  }
  return ClassificationResourceFromJSONTyped(json, true);
}

/**
 * Parse json to valid 'ClassificationVersionResource'
 *
 * @param json
 * @returns ClassificationVersionResource
 */
export function parseVersion(json?: object | null): ClassificationVersionResource {
  if (json == null) {
    throw new Error(`Object is null: ${json}`);
  }
  if (!instanceOfClassificationVersion(json)) {
    throw new Error(`Invalid classification version: ${JSON.stringify(json)}`);
  }
  return ClassificationVersionResourceFromJSONTyped(json, true);
}

/**
 * Returns a classification type for a  display label.
 *
 * @param it - The display label.
 * @returns The  classification type.
 */
export const getClassificationTypeForLabel = (it: string) => {
  switch (it) {
    case localization.classification.standard:
      return ClassificationType.Klassifikasjon;
    case localization.classification.codelist:
      return ClassificationType.Kodeliste;
    default:
      return it;
  }
};

/**
 * Returns a display label for a classification type.
 *
 * @param it - The classification type.
 * @returns The label to display for the classification type.
 */
export const getLabelForClassificationType = (it: string) => {
  switch (it) {
    case ClassificationType.Klassifikasjon:
      return localization.classification.standard;
    case ClassificationType.Kodeliste:
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