import { describe, expect, it } from 'vitest';
import type { KlassCode } from '@/types/klass-codes';
import { buildCodeTree } from './buildCodeTree';
import { flattenVisibleCodeTree } from './flattenVisibleCodeTree';

function makeCode(overrides: Partial<KlassCode> & { code: string; level: string }): KlassCode {
  return {
    parentCode: null,
    name: `Code ${overrides.code}`,
    validFrom: '2020-01-01',
    ...overrides,
  };
}

describe('flattenVisibleCodeTree', () => {
  it('returns an empty array for an empty tree', () => {
    expect(flattenVisibleCodeTree([], new Set())).toEqual([]);
  });

  it('returns every root node at depth 0 when nothing is expanded', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'A', level: '1' }),
      makeCode({ code: 'A1', level: '2', parentCode: 'A' }),
      makeCode({ code: 'B', level: '1' }),
    ];
    const tree = buildCodeTree(codes);

    const rows = flattenVisibleCodeTree(tree, new Set());

    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.node.code.code)).toEqual(['A', 'B']);
    expect(rows.every((r) => r.depth === 0)).toBe(true);
  });

  it('includes children immediately after their parent when the parent is expanded', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'A', level: '1' }),
      makeCode({ code: 'A1', level: '2', parentCode: 'A' }),
      makeCode({ code: 'A2', level: '2', parentCode: 'A' }),
      makeCode({ code: 'B', level: '1' }),
    ];
    const tree = buildCodeTree(codes);

    const rows = flattenVisibleCodeTree(tree, new Set(['A']));

    expect(rows.map((r) => ({ code: r.node.code.code, depth: r.depth }))).toEqual([
      { code: 'A', depth: 0 },
      { code: 'A1', depth: 1 },
      { code: 'A2', depth: 1 },
      { code: 'B', depth: 0 },
    ]);
  });

  it('does not descend into the children of a collapsed node even if a deeper node is expanded', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'A', level: '1' }),
      makeCode({ code: 'A1', level: '2', parentCode: 'A' }),
      makeCode({ code: 'A1a', level: '3', parentCode: 'A1' }),
    ];
    const tree = buildCodeTree(codes);

    // 'A1' is expanded but its parent 'A' is not, so neither A1 nor A1a should appear.
    const rows = flattenVisibleCodeTree(tree, new Set(['A1']));

    expect(rows.map((r) => r.node.code.code)).toEqual(['A']);
  });

  it('recurses through multiple expanded levels in depth-first order', () => {
    const codes: KlassCode[] = [
      makeCode({ code: 'A', level: '1' }),
      makeCode({ code: 'A1', level: '2', parentCode: 'A' }),
      makeCode({ code: 'A1a', level: '3', parentCode: 'A1' }),
      makeCode({ code: 'A2', level: '2', parentCode: 'A' }),
    ];
    const tree = buildCodeTree(codes);

    const rows = flattenVisibleCodeTree(tree, new Set(['A', 'A1']));

    expect(rows.map((r) => ({ code: r.node.code.code, depth: r.depth }))).toEqual([
      { code: 'A', depth: 0 },
      { code: 'A1', depth: 1 },
      { code: 'A1a', depth: 2 },
      { code: 'A2', depth: 1 },
    ]);
  });
});
