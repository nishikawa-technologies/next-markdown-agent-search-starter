import type { PageRepository } from '@/domain/content/repositories/PageRepository';
import { describe, expect, it, vi } from 'vitest';
import { Page } from '@/domain/content/entities/Page';
import { Locale } from '@/domain/content/value-objects/Locale';
import { PageSlug } from '@/domain/content/value-objects/PageSlug';
import { GetPageUseCase } from './GetPageUseCase';
import { PageNotFoundError } from './PageNotFoundError';

describe('getPageUseCase', () => {
  it('returns a page when the repository finds it', async () => {
    const page = Page.create({
      locale: Locale.create('ja'),
      slug: PageSlug.create('index'),
      title: 'Home',
      description: 'Welcome',
      body: '# Home',
    });
    const repository: PageRepository = {
      findByLocaleAndSlug: vi.fn().mockResolvedValue(page),
    };
    const useCase = new GetPageUseCase(repository);

    const result = await useCase.execute({
      locale: Locale.create('ja'),
      slug: PageSlug.create('index'),
    });

    expect(result).toBe(page);
  });

  it('throws when the repository does not find a page', async () => {
    const repository: PageRepository = {
      findByLocaleAndSlug: vi.fn().mockResolvedValue(null),
    };
    const useCase = new GetPageUseCase(repository);

    await expect(
      useCase.execute({
        locale: Locale.create('en'),
        slug: PageSlug.create('missing'),
      }),
    ).rejects.toThrow(PageNotFoundError);
  });
});
