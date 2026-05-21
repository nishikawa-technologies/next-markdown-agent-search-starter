import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

export const agentDiscoveryPaths = {
  llmsTxt: '/llms.txt',
  knowledgeIndex: '/agent-search-index.json',
  knowledgeSpec: '/SPEC.md',
  searchApi: '/api/agent/search',
} as const;

/** Root `/llms.txt` for LLMs and agents discovering Sazanami-powered sites. */
export function buildLlmsTxt(): string {
  const base = getBaseUrl().trim().replace(/\/$/, '');

  return `# ${AppConfig.name}

> This site is powered by **Sazanami**, a Next.js + Markdown corporate-site starter with a build-time knowledge index and a read-only search API for agents and internal tools.

## What this site exposes

- **Human-readable pages**: localized Markdown content for company, leadership, products, solutions, contact, legal, news, and financial pages.
- **Machine-readable knowledge index**: one JSON file containing page/news/financial entries with titles, descriptions, paths, source kinds, and normalized text.
- **Focused retrieval API**: a POST endpoint that returns ranked snippets for a query without requiring crawlers or a hosted search service.
- **Specification document**: a Markdown spec describing the index schema and API response shape.

## Start here (human-readable pages)

- [Home](${base}/): Site home.
- [Company](${base}/company/): Company profile placeholder.
- [Leadership](${base}/leadership/): Leadership placeholder.
- [Products](${base}/products/): Product overview placeholder.
- [Solutions](${base}/solutions/): Solutions overview placeholder.
- [News](${base}/news/): News articles.
- [English mirror](${base}/en/): Same structure under \`/en/\`.

## Knowledge bundle (recommended for LLMs)

**Best first step:** download the build-time index. It is structured JSON with public page, news article, and financial summary content.

- [**agent-search-index.json**](${base}${agentDiscoveryPaths.knowledgeIndex}): GET, no authentication. Use this when you need broad site context in one request.
- [**SPEC.md**](${base}${agentDiscoveryPaths.knowledgeSpec}): Schema for the index (\`version\`, \`generatedAt\`, \`locales\`, entry fields, \`sourceKind\`, Search API shape). Read this before parsing the JSON.
- [**Search API**](${base}${agentDiscoveryPaths.searchApi}): \`POST\` JSON \`{ "q": string, "locale"?: "ja"|"en", "limit"?: 1-50 }\` → ranked \`hits\` with snippets. Production requires \`AGENT_SEARCH_API_KEY\`.

## Site map

- [sitemap.xml](${base}/sitemap.xml): Canonical URLs including discovery resources.
- [robots.txt](${base}/robots.txt): Crawler rules.

## Note

Replace the placeholder content, brand assets, and legal text before using this starter in production.
`;
}
