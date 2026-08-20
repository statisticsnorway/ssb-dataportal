export function createDownloadBlob(content: string, mimeType: string, fileName: string): Blob {
  const lowerFileName = fileName.toLowerCase();
  const lowerMimeType = mimeType.toLowerCase();
  const isUtf8TextDownload =
    lowerFileName.endsWith('.csv') ||
    lowerFileName.endsWith('.xml') ||
    lowerFileName.endsWith('.json') ||
    lowerMimeType.includes('text/csv') ||
    lowerMimeType.includes('application/xml') ||
    lowerMimeType.includes('application/json');
  const utf8Content = content.startsWith('\uFEFF') ? content : `\uFEFF${content}`;
  const blobContent = isUtf8TextDownload ? utf8Content : content;
  const blobType = isUtf8TextDownload && !lowerMimeType.includes('charset=') ? `${mimeType};charset=utf-8` : mimeType;
  return new Blob([blobContent], { type: blobType });
}
