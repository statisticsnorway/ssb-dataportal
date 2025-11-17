import { NextRequest, NextResponse } from 'next/server';
import { CLASSIFICATION_FAMILIES, KLASS_HOST } from '@/utils/constants';

export async function GET(
  request: NextRequest, // Is necessary
  context: { params: { id: string } },
) {
  const { searchParams } = new URL(request.url);
  const includeCodelists = searchParams.get('includeCodelists') ?? false;
  const { id } = await context.params; // await is necessary in Nextjs 15+

  const url = `${KLASS_HOST}${CLASSIFICATION_FAMILIES}/${id}?includeCodelists=${includeCodelists}`;
  console.log('Fetching from external API:', url);

  try {
    const response = await fetch(url);

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching external API', details: (error as Error).message },
      { status: 500 },
    );
  }
}
