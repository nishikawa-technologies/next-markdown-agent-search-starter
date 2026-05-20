import { describe, expect, it } from 'vitest';
import { stripMarkdownForIndex } from './stripMarkdownForIndex';

describe('stripMarkdownForIndex', () => {
  it('removes code fences and headers', () => {
    const out = stripMarkdownForIndex(`# Hello

Some \`inline\`.

\`\`\`ts
ignored
\`\`\`

[link](/path)
`);

    expect(out).not.toContain('ignored');
    expect(out).not.toContain('#');
    expect(out).toContain('link');
  });
});
