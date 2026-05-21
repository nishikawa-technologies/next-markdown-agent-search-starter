import { describe, expect, it } from 'vitest';
import { agentDiscoveryPaths, buildLlmsTxt } from '@/utils/agentDiscovery';

describe('agentDiscovery', () => {
  it('buildLlmsTxt explains Sazanami and points to the knowledge resources', () => {
    const text = buildLlmsTxt();

    expect(text).toMatch(/^# Example Corporation/m);
    expect(text).toContain('Sazanami');
    expect(text).toContain('Knowledge bundle');
    expect(text).toContain(agentDiscoveryPaths.knowledgeIndex);
    expect(text).toContain(agentDiscoveryPaths.knowledgeSpec);
    expect(text).toContain(agentDiscoveryPaths.searchApi);
    expect(text).toContain('AGENT_SEARCH_API_KEY');
  });
});
