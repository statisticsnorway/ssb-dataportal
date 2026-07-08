/**
 * A parsed section from a KLASS code's `notes` field.
 * The `title` is the label before the colon (e.g. "Omfatter"), or `null` when
 * the notes string contains plain text without any section headers.
 */
export interface NotesSection {
  title: string | null;
  content: string;
}

/**
 * Parses a KLASS notes string into labelled sections.
 *
 * The API returns notes as a plain-text string where sections are separated
 * by a `\n` and each section begins with a title line ending in `:`, e.g.:
 *
 * ```
 * Omfatter:\nThis code covers…\nOmfatter også:\nAlso includes…\nEkskluderer:\nNot included…
 * ```
 *
 * Lines that don't follow the `title:\ncontent` pattern are returned as
 * untitled sections so no text is lost.
 */
export function parseNotes(notes: string): NotesSection[] {
  const lines = notes.split('\n').filter((line) => line.trim().length > 0);
  const sections: NotesSection[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    const nextLine = lines[i + 1];

    // A title line ends with ':' and is followed by a content line
    if (line.endsWith(':') && nextLine !== undefined) {
      sections.push({ title: line.slice(0, -1), content: nextLine });
      i += 2;
    } else {
      // Plain text without a preceding title (e.g. "Ny fra 01.01.2016")
      sections.push({ title: null, content: line });
      i += 1;
    }
  }

  return sections;
}
