import { DownloadChangesRouteDialog } from '@/app/(details)/classifications/components/download-dialog/route-dialogs';
import ChangesVersion from '../page';

export default function ClassificationChangesDownloadPage() {
  return (
    <>
      <ChangesVersion />
      <DownloadChangesRouteDialog />
    </>
  );
}
