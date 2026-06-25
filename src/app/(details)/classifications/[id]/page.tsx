import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import ClassificationDetail from './classificationDetail';

interface ClassificationPageProps {
  params: { id: string };
}

export default async function Classification({ params }: ClassificationPageProps) {
  const { id } = params;
  const numId = Number(id);
  const classification = await fetchClassificationById(numId);

  if (!classification) {
    return <div>Klassifikasjon ikke funnet</div>;
  }
  return <ClassificationDetail classification={classification} />;
}
