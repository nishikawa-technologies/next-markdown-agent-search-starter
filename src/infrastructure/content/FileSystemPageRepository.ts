import type { PageRepository } from '@/domain/content/repositories/PageRepository';
import type { Locale } from '@/domain/content/value-objects/Locale';
import type { PageSlug } from '@/domain/content/value-objects/PageSlug';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Page } from '@/domain/content/entities/Page';
import { parseMarkdownFile } from './parseMarkdownFile';

export class FileSystemPageRepository implements PageRepository {
  constructor(private readonly contentRoot: string) {}

  async findByLocaleAndSlug(
    locale: Locale,
    slug: PageSlug,
  ): Promise<Page | null> {
    const filePath = path.join(
      this.contentRoot,
      locale.code,
      slug.toFileName(),
    );

    try {
      const source = await fs.readFile(filePath, 'utf8');
      const parsed = parseMarkdownFile(source);

      return Page.create({
        locale,
        slug,
        title: parsed.title,
        description: parsed.description,
        body: parsed.body,
      });
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }

      throw error;
    }
  }
}
