import { Heading, Paragraph } from '@digdir/designsystemet-react';
import { ClassificationResource } from '@/libs/data-access/klass/models';

interface AboutViewProps {
  classification: ClassificationResource;
}
export default async function AboutView({ classification }: AboutViewProps) {
  return (
    <div>
      <Heading>{classification.name}</Heading>
      <Paragraph>{classification.description}</Paragraph>
      {/*
       * Key - value table
        Levels - table
        Changelog - table
       */}
    </div>
  );
}
