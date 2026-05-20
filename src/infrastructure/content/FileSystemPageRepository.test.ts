import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Locale } from '@/domain/content/value-objects/Locale';
import { PageSlug } from '@/domain/content/value-objects/PageSlug';
import { FileSystemPageRepository } from './FileSystemPageRepository';

describe('fileSystemPageRepository', () => {
  let contentRoot: string;

  beforeEach(async () => {
    contentRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'content-'));
    const jaDir = path.join(contentRoot, 'ja');
    await fs.mkdir(jaDir, { recursive: true });
    await fs.writeFile(
      path.join(jaDir, 'index.md'),
      `---
title: Home
description: Welcome
---
# Home

Body text
`,
      'utf8',
    );
  });

  afterEach(async () => {
    await fs.rm(contentRoot, { recursive: true, force: true });
  });

  it('loads markdown pages with frontmatter', async () => {
    const repository = new FileSystemPageRepository(contentRoot);
    const page = await repository.findByLocaleAndSlug(
      Locale.create('ja'),
      PageSlug.create('index'),
    );

    expect(page).not.toBeNull();
    expect(page?.title).toBe('Home');
    expect(page?.description).toBe('Welcome');
    expect(page?.body).toContain('# Home');
    expect(page?.body).toContain('Body text');
  });

  it('returns null when a page file does not exist', async () => {
    const repository = new FileSystemPageRepository(contentRoot);
    const page = await repository.findByLocaleAndSlug(
      Locale.create('ja'),
      PageSlug.create('missing'),
    );

    expect(page).toBeNull();
  });
});
