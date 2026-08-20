import { describe, expect, it } from 'vitest';
import { createDownloadBlob } from './download-utils';

async function toBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

describe('createDownloadBlob', () => {
  it.each([
    { fileName: 'codes.csv', mimeType: 'text/csv' },
    { fileName: 'codes.xml', mimeType: 'application/xml' },
    { fileName: 'codes.json', mimeType: 'application/json' },
  ])('adds utf-8 BOM and charset for $fileName downloads', async ({ fileName, mimeType }) => {
    const blob = createDownloadBlob('a,ø', mimeType, fileName);
    const bytes = await toBytes(blob);

    expect(blob.type).toBe(`${mimeType};charset=utf-8`);
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
  });

  it('does not add BOM when one already exists', async () => {
    const blob = createDownloadBlob('\uFEFFalready-prefixed', 'application/json', 'codes.json');
    const bytes = await toBytes(blob);

    expect(Array.from(bytes.slice(0, 4))).toEqual([0xef, 0xbb, 0xbf, 0x61]);
  });

  it('keeps non-text-like download unchanged', async () => {
    const blob = createDownloadBlob('raw-binary-content', 'application/octet-stream', 'payload.bin');

    expect(blob.type).toBe('application/octet-stream');
    await expect(blob.text()).resolves.toBe('raw-binary-content');
  });
});
