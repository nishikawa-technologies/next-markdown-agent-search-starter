import matter from 'gray-matter';

export interface ParsedFinancialMarkdownFile {
  title: string;
  description: string;
  periodLabel: string;
  asOf: Date;
  body: string;
}

export function parseFinancialMarkdownFile(source: string): ParsedFinancialMarkdownFile {
  const { content, data } = matter(source);
  const title = typeof data.title === 'string' ? data.title : '';
  const description = typeof data.description === 'string' ? data.description : '';
  const periodLabel = typeof data.periodLabel === 'string' ? data.periodLabel : '';
  const asOfValue = data.asOf;

  if (!title) {
    throw new Error('Financial markdown frontmatter must include title');
  }

  if (!periodLabel) {
    throw new Error('Financial markdown frontmatter must include periodLabel');
  }

  if (typeof asOfValue !== 'string' && !(asOfValue instanceof Date)) {
    throw new TypeError('Financial markdown frontmatter must include asOf');
  }

  const asOf = new Date(asOfValue);

  if (Number.isNaN(asOf.getTime())) {
    throw new TypeError('Financial markdown frontmatter asOf is invalid');
  }

  return {
    title,
    description,
    periodLabel,
    asOf,
    body: content.trim(),
  };
}
