import { describe, expect, it } from 'vitest';
import { parseMarkdownFile } from './parseMarkdownFile';

describe('parseMarkdownFile', () => {
  it('parses YAML frontmatter and markdown body', () => {
    const parsed = parseMarkdownFile(`---
title: About
description: Company profile
---
# About

Details
`);

    expect(parsed.title).toBe('About');
    expect(parsed.description).toBe('Company profile');
    expect(parsed.body).toContain('# About');
    expect(parsed.body).toContain('Details');
  });

  it('requires a title in frontmatter', () => {
    expect(() => parseMarkdownFile('---\ndescription: only\n---\nBody')).toThrow(
      'Markdown frontmatter must include title',
    );
  });
});
