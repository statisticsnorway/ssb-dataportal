export interface BuildUrlProps {
  classificationId?: number | undefined;
  versionId?: number | undefined;
  correspondenceId?: number | undefined;
  variantId?: number | undefined;
  tab?: 'codes' | 'details' | 'changes' | 'correspondences' | 'variants' | undefined;
}

const CLASSIFICATIONS_PATH = '/classifications';
const VERSIONS_PATH_SEGMENT = 'versions';
const CORRESPONDENCES_PATH_SEGMENT = 'correspondences';
const VARIANTS_PATH_SEGMENT = 'variants';
const MISSING_CLASSIFICATION_ID_ERROR = 'No classification ID supplied';
const DOUBLED_IDS_ERROR = "Can't supply correspondence and variant ID together";

export function buildUrl(props: BuildUrlProps): string {
  if (props.correspondenceId && props.variantId) {
    throw new Error(DOUBLED_IDS_ERROR);
  }

  if (!props.classificationId && (props.versionId || props.tab || props.correspondenceId || props.variantId)) {
    throw new Error(MISSING_CLASSIFICATION_ID_ERROR);
  }

  if (props.classificationId) {
    if (props.versionId) {
      if (props.correspondenceId) {
        return `${CLASSIFICATIONS_PATH}/${props.classificationId}/${VERSIONS_PATH_SEGMENT}/${props.versionId}/${CORRESPONDENCES_PATH_SEGMENT}/${props.correspondenceId}`;
      }

      if (props.variantId) {
        return `${CLASSIFICATIONS_PATH}/${props.classificationId}/${VERSIONS_PATH_SEGMENT}/${props.versionId}/${VARIANTS_PATH_SEGMENT}/${props.variantId}`;
      }

      if (props.tab) {
        return `${CLASSIFICATIONS_PATH}/${props.classificationId}/${VERSIONS_PATH_SEGMENT}/${props.versionId}/${props.tab}`;
      }

      return `${CLASSIFICATIONS_PATH}/${props.classificationId}/${VERSIONS_PATH_SEGMENT}/${props.versionId}`;
    }

    if (props.variantId) {
      return `${CLASSIFICATIONS_PATH}/${props.classificationId}/${VARIANTS_PATH_SEGMENT}/${props.variantId}`;
    }

    if (props.tab) {
      return `${CLASSIFICATIONS_PATH}/${props.classificationId}/${props.tab}`;
    }

    return `${CLASSIFICATIONS_PATH}/${props.classificationId}`;
  }

  return CLASSIFICATIONS_PATH;
}
