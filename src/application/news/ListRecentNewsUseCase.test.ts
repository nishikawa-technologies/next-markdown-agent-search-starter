import type { NewsArticleRepository } from '@/domain/news/repositories/NewsArticleRepository';
import { describe, expect, it, vi } from 'vitest';
import { Locale } from '@/domain/content/value-objects/Locale';
import { NewsArticle } from '@/domain/news/entities/NewsArticle';
import { NewsArticleSlug } from '@/domain/news/value-objects/NewsArticleSlug';
import { ListRecentNewsUseCase } from './ListRecentNewsUseCase';

describe('listRecentNewsUseCase', () => {
  it('returns articles sorted by date descending limited to N', async () => {
    const older = NewsArticle.create({
      locale: Locale.create('ja'),
      slug: NewsArticleSlug.create('2025-01-01-older'),
      title: 'Older',
      description: 'Older post',
      publishedAt: new Date('2025-01-01'),
      body: 'Older body',
    });
    const newer = NewsArticle.create({
      locale: Locale.create('ja'),
      slug: NewsArticleSlug.create('2025-05-20-newer'),
      title: 'Newer',
      description: 'Newer post',
      publishedAt: new Date('2025-05-20'),
      body: 'Newer body',
    });
    const repository: NewsArticleRepository = {
      listByLocale: vi.fn().mockResolvedValue([older, newer]),
      findByLocaleAndSlug: vi.fn(),
    };
    const useCase = new ListRecentNewsUseCase(repository);

    const result = await useCase.execute({
      locale: Locale.create('ja'),
      limit: 1,
    });

    expect(result).toEqual([newer]);
  });
});
