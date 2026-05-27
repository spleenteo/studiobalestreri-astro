/**
 * Strips HTML tags and truncates to a plain-text excerpt. Mirrors the old
 * Middleman behaviour (`Truncato.truncate body, max_length: 500`) used when an
 * article has no explicit abstract.
 */
export function excerpt(html: string | null | undefined, maxLength = 320): string {
  if (!html) return '';
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '… (continua)';
}
