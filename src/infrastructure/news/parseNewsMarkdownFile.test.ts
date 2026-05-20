import { describe, expect, it } from 'vitest';
import { parseNewsMarkdownFile } from './parseNewsMarkdownFile';

describe('parseNewsMarkdownFile', () => {
  it('parses title, description, date, and body', () => {
    const parsed = parseNewsMarkdownFile(`---
title: Site launch
description: We launched our site
date: 2025-05-20
---
Hello world
`);

    expect(parsed.title).toBe('Site launch');
    expect(parsed.description).toBe('We launched our site');
    expect(parsed.publishedAt).toEqual(new Date('2025-05-20'));
    expect(parsed.body).toBe('Hello world');
  });

  it('requires a date in frontmatter', () => {
    expect(() => parseNewsMarkdownFile(`---
title: No date
description: Missing date
---
Body
`)).toThrow('News markdown frontmatter must include date');
  });
});
