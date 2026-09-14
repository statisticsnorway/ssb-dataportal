import type { CorrespondenceMapResource, CorrespondenceTableResource } from '@/libs/data-access/klass';

export interface CorrespondenceMapWithNotes extends CorrespondenceMapResource {
  sourceNotes?: string;
  targetNotes?: string;
}

export interface CorrespondenceTableWithNotes extends Omit<CorrespondenceTableResource, 'correspondenceMaps'> {
  correspondenceMaps?: CorrespondenceMapWithNotes[];
}
