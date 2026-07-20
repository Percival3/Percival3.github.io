export const CATEGORY_LABELS = {
  reading: '读书',
  essays: '杂谈',
} as const;

export const BLOG_SECTIONS = [
  {
    key: 'reading' as const,
    label: '读书',
    en: 'Reading',
    desc: '读书笔记与随想。',
  },
  {
    key: 'essays' as const,
    label: '杂谈',
    en: 'Essays',
    desc: '杂感、设计与技术笔记。',
  },
];

export type BlogCategory = keyof typeof CATEGORY_LABELS;

export function categoryHref(category: BlogCategory) {
  return `/blog/${category}`;
}

export function postYear(dateStr: string): number {
  const d = new Date(dateStr);
  return Number.isNaN(d.valueOf()) ? new Date().getFullYear() : d.getFullYear();
}

export function collectYears(dates: string[]): number[] {
  const years = new Set(dates.map(postYear));
  return [...years].sort((a, b) => b - a);
}

export type BlogTocItem = {
  id: string;
  title: string;
  category: BlogCategory;
  description?: string;
};
