import type { CollectionEntry } from 'astro:content';
import path from 'node:path';

const INTRO_LONG_THRESHOLD = 120;

/** Vite-resolved URLs for PDFs co-located under src/content/blog */
const pdfUrlModules = import.meta.glob('../content/blog/**/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function normalizeSlashes(p: string) {
  return p.replace(/\\/g, '/');
}

/** Collection id for folder entries is often `slug` or `slug/index` */
export function blogSlug(entry: CollectionEntry<'blog'>): string {
  return entry.id.replace(/\/index$/, '');
}

export function isPublishedPdf(entry: CollectionEntry<'blog'>): boolean {
  return Boolean(entry.data.pdf?.trim());
}

export function bodyCharCount(entry: CollectionEntry<'blog'>): number {
  return (entry.body ?? '').replace(/\s+/g, '').length;
}

export function isLongIntro(entry: CollectionEntry<'blog'>): boolean {
  if (entry.data.intro === 'long') return true;
  if (entry.data.intro === 'short') return false;
  return bodyCharCount(entry) > INTRO_LONG_THRESHOLD;
}

export function resolveBlogPdfUrl(entry: CollectionEntry<'blog'>): string | undefined {
  const pdfName = entry.data.pdf?.trim();
  if (!pdfName) return undefined;
  if (pdfName.startsWith('/')) return pdfName;

  const slug = blogSlug(entry);
  const needle = `/content/blog/${slug}/${pdfName}`;

  for (const [key, url] of Object.entries(pdfUrlModules)) {
    if (normalizeSlashes(key).endsWith(needle)) {
      return url;
    }
  }
  return undefined;
}

export function entryTitleHref(entry: CollectionEntry<'blog'>, pdfUrl?: string): string {
  if (isLongIntro(entry)) return `/blog/${blogSlug(entry)}`;
  return pdfUrl ?? '#';
}

export function pdfDownloadName(entry: CollectionEntry<'blog'>): string {
  const raw = entry.data.pdf?.trim() || 'note.pdf';
  return path.posix.basename(raw);
}

export function formatTimelineDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.valueOf())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}
