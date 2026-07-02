/**
 * Application-level representation of a single code from a KLASS classification.
 * Adapts the generated `CodeItem` API type with required fields made explicit.
 */
export interface KlassCode {
  code: string;
  parentCode: string | null;
  level: string;
  name: string;
  shortName?: string;
  presentationName?: string;
  validFrom: string;
  validTo?: string;
  notes?: string;
}

/**
 * A node in the recursive code tree built from a flat `KlassCode[]`.
 */
export interface CodeTreeNode {
  code: KlassCode;
  children: CodeTreeNode[];
}
