import { fetchClassificationById } from '@/libs/data/classificationData';
import ClassificationDetails from './classificationDetail';

interface ClassificationPageProps {
  params: { id: string };
}

export default async function Classification({ params }: ClassificationPageProps) {
  // await is Next necessary
  const { id } = await params;
  const numId = Number(id);
  const classification = await fetchClassificationById(numId);

  if (!classification) {
    return <div>Klassifikasjon ikke funnet</div>;
  }
  return <ClassificationDetails classification={classification} />;
}
