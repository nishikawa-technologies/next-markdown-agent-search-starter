import { SearchKnowledgeForAgentUseCase } from '@/application/agent-search/SearchKnowledgeForAgentUseCase';
import { FileBackedSearchableContentRepository } from '@/infrastructure/agent-search/FileBackedSearchableContentRepository';

const repository = new FileBackedSearchableContentRepository();

export const searchKnowledgeForAgentUseCase = new SearchKnowledgeForAgentUseCase(
  repository,
);
