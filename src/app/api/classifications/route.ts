import { NextResponse } from 'next/server';
import { CLASSIFICATION_FAMILIES, KLASS_HOST } from '@/utils/constants';

export async function GET() {
  const url = `${KLASS_HOST}${CLASSIFICATION_FAMILIES}`;
  console.log('Fetching from external API:', url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API returned error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'External API error',
          status: response.status,
          body: errorText,
        },
        { status: 500 },
      );
    }
    const data = await response.json();
    return NextResponse.json(
      {
        classificationfamilies: data._embedded.classificationFamilies ?? [],
        links: data._links,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Fetch failed', details: (error as Error).message }, { status: 500 });
  }
}
