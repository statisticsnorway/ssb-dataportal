export interface BuildUrlProps {
  dataProductShortName?: string;
  datasetId?: string;
}

/**
 * Builds a URL for a data product or a specific dataset within a data product.
 * @param param0 The build URL properties containing optional data product short name and dataset ID.
 * @returns The constructed URL for the data product or dataset.
 */
export function buildUrlDataProducts({ dataProductShortName, datasetId }: BuildUrlProps): string {
  if (datasetId !== undefined && !dataProductShortName) {
    throw new Error('No data product short name supplied');
  }

  if (!dataProductShortName) {
    return '/data-products';
  }

  const dataProductPath = `/data-products/${encodeURIComponent(dataProductShortName)}`;

  if (datasetId !== undefined) {
    return `${dataProductPath}/datasets/${encodeURIComponent(datasetId)}`;
  }

  return dataProductPath;
}