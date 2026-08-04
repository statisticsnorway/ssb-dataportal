import {
  ClassificationResource,
  ClassificationResourceFromJSONTyped,
  ClassificationVersionResource,
  ClassificationVersionResourceFromJSONTyped,
} from '@/libs/data-access/klass';
import { RenderedView, RenderedViewFromJSON } from '@/libs/data-access/variable-definitions/internal';
import classificationsMock from '@/static-data/classifications.json';
import subjectFieldsMock from '@/static-data/codes-mock.json';
import variableDefinitionsJson from '@/static-data/variable-definitions.json';
import { getClassificationTypeFromString } from '@/types/classification';
import { FilterItem } from '@/types/filters';

export function getStaticVariableDefinitions(): Array<RenderedView> {
  return variableDefinitionsJson.map(RenderedViewFromJSON);
}
export function getStaticVariableDefinitionByShortName(shortName: string): RenderedView | undefined {
  return getStaticVariableDefinitions().find((v) => String(v.short_name) === shortName);
}
export function getStaticVariableDefinitionById(id: string): RenderedView | undefined {
  return getStaticVariableDefinitions().find((v) => String(v.id) === id);
}

export function getClassification(id: number): ClassificationResource {
  const classifications = classificationsMock.classifications;
  const classification = classifications.find((v) => v.id === id);
  return parseClassification(classification);
}

export const getSubjectFieldFilterItems: FilterItem[] = subjectFieldsMock.versionCodes['2828'].map((item) => ({
  label: String(item.name),
  value: String(item.code),
}));

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
 * ONLY USED FOR MOCK DATA AND TESTING, NOT PART OF DATA FLOW FROM API
 *
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
  const classificationResource = ClassificationResourceFromJSONTyped(json, true);
  classificationResource.classificationType = getClassificationTypeFromString(
    classificationResource.classificationType,
  );
  return classificationResource;
}

/**
 * ONLY USED FOR MOCK DATA AND TESTING, NOT PART OF DATA FLOW FROM API
 *
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
