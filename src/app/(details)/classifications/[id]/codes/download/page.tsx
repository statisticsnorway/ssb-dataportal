import { DownloadCodesRouteDialog } from '@/app/(details)/classifications/components/download-dialog/route-dialogs';
import CodesVersion from '../page';

export default function ClassificationCodesDownloadPage() {
  return (
    <>
      <CodesVersion />
      <DownloadCodesRouteDialog />
    </>
  );
}
