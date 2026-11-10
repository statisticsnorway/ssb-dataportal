import type { ClassificationVersionResource } from '@/libs/data-access/klass';
import { mockClassificationVersion } from '@/stories/fixtures';

export async function fetchVersionById(): Promise<ClassificationVersionResource> {
  return mockClassificationVersion;
}
