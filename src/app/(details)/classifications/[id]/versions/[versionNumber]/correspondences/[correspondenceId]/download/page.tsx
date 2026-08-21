import { DownloadCorrespondenceRouteDialog } from '@/app/(details)/classifications/components/download-dialog/route-dialogs';
import CorrespondencePage from '../page';

export default function CorrespondenceDownloadPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; versionNumber: string; correspondenceId: string }>;
}>) {
  return (
    <>
      <CorrespondencePage params={params} />
      <DownloadCorrespondenceRouteDialog />
    </>
  );
}
