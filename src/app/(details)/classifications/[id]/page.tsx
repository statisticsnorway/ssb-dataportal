import ClassificationDetail from './classificationDetail';

interface ClassificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function Classification({ params }: Readonly<ClassificationPageProps>) {
  const { id } = await params;
  return <ClassificationDetail id={id} />;
}
