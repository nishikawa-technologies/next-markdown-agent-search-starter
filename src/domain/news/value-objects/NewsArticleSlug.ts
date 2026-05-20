const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class InvalidNewsArticleSlugError extends Error {
  constructor(slug: string) {
    super(`Invalid news article slug: ${slug}`);
    this.name = 'InvalidNewsArticleSlugError';
  }
}

export class NewsArticleSlug {
  private constructor(readonly value: string) {}

  static create(raw: string): NewsArticleSlug {
    if (!SLUG_PATTERN.test(raw)) {
      throw new InvalidNewsArticleSlugError(raw);
    }

    return new NewsArticleSlug(raw);
  }

  static fromFileName(fileName: string): NewsArticleSlug {
    if (!fileName.endsWith('.md')) {
      throw new InvalidNewsArticleSlugError(fileName);
    }

    return NewsArticleSlug.create(fileName.slice(0, -3));
  }

  toFileName(): string {
    return `${this.value}.md`;
  }
}
