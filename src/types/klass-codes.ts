import type { ClassificationItemResource } from '@/libs/data-access/klass/models/ClassificationItemResource';

/**
 * A node in the recursive code tree built from a flat `KlassCode[]`.
 */
export interface CodeTreeNode {
  code: ClassificationItemResource;
  children: CodeTreeNode[];
}
