/**
 * HTML utilities for CMS payloads.
 *
 * WPGraphQL often returns title / excerpt / setting strings HTML-encoded
 * (e.g. "Atiku dismisses Tinubu&#8217;s 10 million votes"). Rendering those
 * directly in React produces double-encoded output (`&amp;amp;`), so every
 * CMS string is decoded here before it leaves the data layer.
 *
 * Pure functions, no I/O — safe to import from anywhere.
 */

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#039;": "'",
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8230;": "…",
  "&hellip;": "…",
  "&nbsp;": " ",
  "&ndash;": "–",
  "&mdash;": "—",
};

export function decodeHtml(s: string): string {
  let out = s.replace(/&[a-zA-Z][a-zA-Z0-9]*;/g, (m) => HTML_ENTITIES[m] ?? m);
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return out;
}

export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

/** Strip tags + decode entities + collapse whitespace. The default for any
 *  CMS string going into a React `{}` interpolation. */
export function htmlToText(html: string): string {
  return decodeHtml(stripTags(html)).replace(/\s+/g, " ").trim();
}

/**
 * Strip the trailing "[…]" / "[...]" / "…" that WordPress auto-excerpts append,
 * so meta descriptions and social link previews read as a clean sentence.
 */
export function tidyExcerpt(text: string): string {
  return text.replace(/\s*(?:\[\s*(?:…|\.\.\.)\s*\]|…|\.\.\.)\s*$/u, "").trim();
}

export function htmlToParagraphs(html: string): string[] {
  return html
    .split(/<\/p>/i)
    .map(htmlToText)
    .filter((p) => p.length > 0);
}

const WORDS_PER_MIN = 220;
export function readTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MIN));
}
