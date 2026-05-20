import matter from 'gray-matter';

export interface ParsedNewsMarkdownFile {
  title: string;
  description: string;
  publishedAt: Date;
  body: string;
}

export function parseNewsMarkdownFile(source: string): ParsedNewsMarkdownFile {
  const { content, data } = matter(source);
  const title = typeof data.title === 'string' ? data.title : '';
  const description = typeof data.description === 'string' ? data.description : '';
  const dateValue = data.date;

  if (!title) {
    throw new Error('News markdown frontmatter must include title');
  }

  if (typeof dateValue !== 'string' && !(dateValue instanceof Date)) {
    throw new TypeError('News markdown frontmatter must include date');
  }

  const publishedAt = new Date(dateValue);

  if (Number.isNaN(publishedAt.getTime())) {
    throw new TypeError('News markdown frontmatter date is invalid');
  }

  return {
    title,
    description,
    publishedAt,
    body: content.trim(),
  };
}
