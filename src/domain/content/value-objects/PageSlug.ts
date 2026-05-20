const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class InvalidPageSlugError extends Error {
  constructor(slug: string) {
    super(`Invalid page slug: ${slug}`);
    this.name = 'InvalidPageSlugError';
  }
}

export class PageSlug {
  private constructor(readonly value: string) {}

  static create(raw: string): PageSlug {
    if (raw === 'index') {
      return new PageSlug('index');
    }

    if (!SLUG_PATTERN.test(raw)) {
      throw new InvalidPageSlugError(raw);
    }

    return new PageSlug(raw);
  }

  static fromPathSegments(segments: string[]): PageSlug {
    if (segments.length === 0) {
      return PageSlug.create('index');
    }

    if (segments.length === 1 && segments[0]) {
      return PageSlug.create(segments[0]);
    }

    throw new InvalidPageSlugError(segments.join('/'));
  }

  toPathSegment(): string {
    return this.value === 'index' ? '' : this.value;
  }

  toFileName(): string {
    return `${this.value}.md`;
  }
}
