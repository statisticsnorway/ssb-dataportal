export const pad2 = (value: number): string => String(value).padStart(2, '0');

export const getFileNameFromFilePath = (filePath: string): string => filePath.split('/').at(-1) ?? '';
