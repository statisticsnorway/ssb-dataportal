export async function getMetadata(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch metadata from ${url}`);
  }

  const data = await res.json();
  return data;
}
