import type { SearchableContentRepository } from '@/domain/agent-search/repositories/SearchableContentRepository';
import type { AgentSearchQuery } from '@/domain/agent-search/value-objects/AgentSearchQuery';
import { describe, expect, it, vi } from 'vitest';
import { AgentSearchResult } from '@/domain/agent-search/entities/AgentSearchResult';
import { SearchHit } from '@/domain/agent-search/entities/SearchHit';
import { Locale } from '@/domain/content/value-objects/Locale';
import { SearchKnowledgeForAgentUseCase } from './SearchKnowledgeForAgentUseCase';

describe('searchKnowledgeForAgentUseCase', () => {
  it('delegates to repository', async () => {
    const expected = AgentSearchResult.create([
      SearchHit.create({
        sourceKind: 'page',
        path: '/company/',
        title: '会社',
        description: '',
        snippet: '',
      }),
    ]);

    const repository: SearchableContentRepository = {
      async search(_query: AgentSearchQuery): Promise<AgentSearchResult> {
        return expected;
      },
    };

    const spy = vi.spyOn(repository, 'search');
    const useCase = new SearchKnowledgeForAgentUseCase(repository);

    const result = await useCase.execute({
      q: 'test',
      locale: Locale.create('ja'),
      limit: 5,
    });

    expect(spy).toHaveBeenCalledOnce();
    expect(result.hits.length).toBe(1);
    expect(result.hits[0]?.path).toBe('/company/');
  });

  it('passes query length constraints to domain query creation', async () => {
    const repository: SearchableContentRepository = {
      async search(_query: AgentSearchQuery): Promise<AgentSearchResult> {
        return AgentSearchResult.empty();
      },
    };
    const useCase = new SearchKnowledgeForAgentUseCase(repository);

    await expect(
      useCase.execute({
        q: 'abcd',
        locale: Locale.create('ja'),
        maxQueryLength: 3,
      }),
    ).rejects.toThrow('q must be 3 characters or fewer');
  });
});
