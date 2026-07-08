import { describe, expect, it } from 'vitest';
import type { KlassCode } from '@/types/klass-codes';
import { buildCodeTree } from './buildCodeTree';

function makeCode(overrides: Partial<KlassCode> & { code: string; level: string }): KlassCode {
  return {
    parentCode: null,
    name: `Code ${overrides.code}`,
    validFrom: '2020-01-01',
    ...overrides,
  };
}

describe('buildCodeTree', () => {
  it('returns an empty array for empty input', () => {
    expect(buildCodeTree([])).toEqual([]);
  });

  it('returns flat single-level codes as root nodes with no children', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'A', level: '1' }),
      makeCode({ code: 'B', level: '1' }),
      makeCode({ code: 'C', level: '1' }),
    ];

    const tree = buildCodeTree(codes);

    expect(tree).toHaveLength(3);
    expect(tree[0]!.code.code).toBe('A');
    expect(tree[1]!.code.code).toBe('B');
    expect(tree[2]!.code.code).toBe('C');
    for (const node of tree) {
      expect(node.children).toHaveLength(0);
    }
  });

  it('nests children under their parent at multiple levels', () => {
    const codes: KlassCode[] = [
      makeCode({ code: '1', level: '1', parentCode: null }),
      makeCode({ code: '1.1', level: '2', parentCode: '1' }),
      makeCode({ code: '1.2', level: '2', parentCode: '1' }),
      makeCode({ code: '1.1.1', level: '3', parentCode: '1.1' }),
      makeCode({ code: '2', level: '1', parentCode: null }),
    ];

    const tree = buildCodeTree(codes);

    expect(tree).toHaveLength(2);

    const node1 = tree[0]!;
    expect(node1.code.code).toBe('1');
    expect(node1.children).toHaveLength(2);

    const node11 = node1.children[0]!;
    expect(node11.code.code).toBe('1.1');
    expect(node11.children).toHaveLength(1);
    expect(node11.children[0]!.code.code).toBe('1.1.1');
    expect(node11.children[0]!.children).toHaveLength(0);

    const node12 = node1.children[1]!;
    expect(node12.code.code).toBe('1.2');
    expect(node12.children).toHaveLength(0);

    expect(tree[1]!.code.code).toBe('2');
    expect(tree[1]!.children).toHaveLength(0);
  });

  it('treats a code with an orphaned parentCode (not in the array) as a root node', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'X', level: '2', parentCode: 'MISSING' }),
      makeCode({ code: 'Y', level: '1', parentCode: null }),
    ];

    const tree = buildCodeTree(codes);

    expect(tree).toHaveLength(2);
    const rootCodes = tree.map((n) => n.code.code);
    expect(rootCodes).toContain('X');
    expect(rootCodes).toContain('Y');
  });

  it('preserves sibling insertion order', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'P', level: '1', parentCode: null }),
      makeCode({ code: 'C3', level: '2', parentCode: 'P' }),
      makeCode({ code: 'C1', level: '2', parentCode: 'P' }),
      makeCode({ code: 'C2', level: '2', parentCode: 'P' }),
    ];

    const tree = buildCodeTree(codes);
    const childCodes = tree[0]!.children.map((n) => n.code.code);
    expect(childCodes).toEqual(['C3', 'C1', 'C2']);
  });
});
