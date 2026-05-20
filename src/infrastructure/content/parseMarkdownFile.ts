import matter from 'gray-matter';

export interface ParsedMarkdownFile {
  title: string;
  description: string;
  body: string;
};

export function parseMarkdownFile(source: string): ParsedMarkdownFile {
  const { content, data } = matter(source);
  const title = typeof data.title === 'string' ? data.title : '';
  const description = typeof data.description === 'string' ? data.description : '';

  if (!title) {
    throw new Error('Markdown frontmatter must include title');
  }

  return {
    title,
    description,
    body: content.trim(),
  };
}
