import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Locale } from '@/domain/content/value-objects/Locale';
import { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';
import { FileSystemNewsArticleRepository } from './FileSystemNewsArticleRepository';

describe('fileSystemNewsArticleRepository', () => {
  let contentRoot: string;

  beforeEach(async () => {
    contentRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'news-content-'));
    const newsDir = path.join(contentRoot, 'ja', 'news');
    await fs.mkdir(newsDir, { recursive: true });
    await fs.writeFile(
      path.join(newsDir, '2025-05-20-launch.md'),
      `---
title: Launch
description: Site launch
date: 2025-05-20
---
Launch body
`,
      'utf8',
    );
    await fs.writeFile(
      path.join(newsDir, '2025-01-01-older.md'),
      `---
title: Older
description: Older post
date: 2025-01-01
---
Older body
`,
      'utf8',
    );
  });

  afterEach(async () => {
    await fs.rm(contentRoot, { recursive: true, force: true });
  });

  it('lists all news articles for a locale', async () => {
    const repository = new FileSystemNewsArticleRepository(contentRoot);
    const articles = await repository.listByLocale(Locale.create('ja'));

    expect(articles).toHaveLength(2);
    expect(articles.map(article => article.slug.value).sort()).toEqual([
      '2025-01-01-older',
      '2025-05-20-launch',
    ]);
  });

  it('loads a single article by slug', async () => {
    const repository = new FileSystemNewsArticleRepository(contentRoot);
    const article = await repository.findByLocaleAndSlug(
      Locale.create('ja'),
      NewsArticleSlug.create('2025-05-20-launch'),
    );

    expect(article?.title).toBe('Launch');
    expect(article?.body).toContain('Launch body');
  });
});
