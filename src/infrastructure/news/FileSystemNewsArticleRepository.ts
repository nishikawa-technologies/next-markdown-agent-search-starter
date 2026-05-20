import type { Locale } from '@/domain/content/value-objects/Locale';
import type { NewsArticleRepository } from '@/domain/news/repositories/NewsArticleRepository';
import type { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';
import fs from 'node:fs/promises';
import path from 'node:path';
import { NewsArticle } from '@/domain/news/entities/NewsArticle';
import { NewsArticleSlug as NewsArticleSlugFactory } from '@/domain/news/value-objects/NewsArticleSlug';
import { parseNewsMarkdownFile } from './parseNewsMarkdownFile';

const INDEX_FILE = 'index.md';

export class FileSystemNewsArticleRepository implements NewsArticleRepository {
  constructor(private readonly contentRoot: string) {}

  async listByLocale(locale: Locale): Promise<NewsArticle[]> {
    const newsDir = this.newsDirFor(locale);
    const entries = await this.readArticleFileNames(newsDir);
    const articles = await Promise.all(
      entries.map(fileName => this.loadArticle(locale, fileName)),
    );

    return articles.filter((article): article is NewsArticle => article !== null);
  }

  async findByLocaleAndSlug(
    locale: Locale,
    slug: NewsArticleSlug,
  ): Promise<NewsArticle | null> {
    return this.loadArticle(locale, slug.toFileName());
  }

  private newsDirFor(locale: Locale): string {
    return path.join(this.contentRoot, locale.code, 'news');
  }

  private async readArticleFileNames(newsDir: string): Promise<string[]> {
    try {
      const entries = await fs.readdir(newsDir);
      return entries.filter(
        name => name.endsWith('.md') && name !== INDEX_FILE,
      );
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  private async loadArticle(
    locale: Locale,
    fileName: string,
  ): Promise<NewsArticle | null> {
    const filePath = path.join(this.newsDirFor(locale), fileName);

    try {
      const source = await fs.readFile(filePath, 'utf8');
      const parsed = parseNewsMarkdownFile(source);
      const slug = NewsArticleSlugFactory.fromFileName(fileName);

      return NewsArticle.create({
        locale,
        slug,
        title: parsed.title,
        description: parsed.description,
        publishedAt: parsed.publishedAt,
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
