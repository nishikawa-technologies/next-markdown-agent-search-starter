# Agent knowledge index specification

This document describes the on-disk and HTTP format of **`/agent-search-index.json`**, generated at build time from `content/` by `npm run generate:agent-search-index` (also run in `prebuild`).

Related: **`POST /api/agent/search`** returns ranked *snippets* from this index (see [Search API](#search-api-response) below).

## File location

| Environment | Path |
| --- | --- |
| Repository | `public/agent-search-index.json` |
| HTTP (production) | `{origin}/agent-search-index.json` |

`Content-Type` is served as `application/json` (static file). No authentication.

## Top-level object

| Field | Type | Description |
| --- | --- | --- |
| `version` | `number` | Schema version. Currently **`1`**. Breaking changes increment this. |
| `generatedAt` | `string` | ISO 8601 UTC timestamp when the file was written at build time. |
| `locales` | `object` | Keys are locale codes (e.g. `ja`, `en`). Values are arrays of entries. |

## Entry object

Each item in `locales[localeCode]` has the following shape:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable identifier: `{sourceKind}:{locale}:{slug}` (see below). |
| `sourceKind` | `string` | One of: `page`, `news`, `financial`. |
| `path` | `string` | Public site path with leading and trailing slashes, matching in-app URLs (locale prefix applied for non-default locale). |
| `title` | `string` | From Markdown frontmatter `title`. |
| `description` | `string` | From frontmatter `description` (empty string if omitted). |
| `text` | `string` | Plain text for search: `title`, `description`, and body after Markdown stripping (whitespace-normalized). |

### `id` format

| sourceKind | Pattern | Example |
| --- | --- | --- |
| `page` | `page:{locale}:{slug}` | `page:ja:company` |
| `news` | `news:{locale}:{articleSlug}` | `news:en:2026-05-20-corporate-site-renewal` |
| `financial` | `financial:{locale}:{period}` | `financial:ja:2026-03` |

`slug` for pages comes from `SITE_PAGE_SLUGS` (`index` for home). News uses the filename without `.md`. Financial uses the period key (e.g. `2026-03`).

### `path` and locale

Default locale (`ja`) uses paths without a locale prefix (e.g. `/company/`). Other locales use a prefix (e.g. `/en/company/`). Home is `/` or `/en/` respectively.

## Example (minimal)

```json
{
  "version": 1,
  "generatedAt": "2026-05-21T00:00:00.000Z",
  "locales": {
    "ja": [
      {
        "id": "page:ja:index",
        "sourceKind": "page",
        "path": "/",
        "title": "Example Corporation",
        "description": "We build things.",
        "text": "Example Corporation We build things. Example Corporation builds things for people who need things built."
      }
    ],
    "en": [
      {
        "id": "page:en:index",
        "sourceKind": "page",
        "path": "/en/",
        "title": "Example Corporation",
        "description": "We build things.",
        "text": "Example Corporation We build things. Example Corporation builds things for people who need things built."
      },
      {
        "id": "financial:en:2026-03",
        "sourceKind": "financial",
        "path": "/en/company/financials/2026-03/",
        "title": "Balance Sheet (Summary)",
        "description": "As of March 31, 2026",
        "text": "Balance Sheet (Summary) As of March 31, 2026 Period 3. Current assets 10,000,000. Total assets 10,500,000. ..."
      }
    ]
  }
}
```

Note: the real index includes every configured locale and all pages, news articles, and financial periods present under `content/`.

## Search API response

`POST /api/agent/search` does **not** return the full index. It returns:

```json
{
  "hits": [
    {
      "sourceKind": "page",
      "path": "/products/",
      "title": "Products",
      "description": "...",
      "snippet": "…excerpt with query terms…"
    }
  ]
}
```

Request body: `{ "q": string, "locale"?: "ja" | "en", "limit"?: number }` (limit 1–50, default 10).

Production requires `AGENT_SEARCH_API_KEY`; requests must send `Authorization: Bearer <AGENT_SEARCH_API_KEY>` or `X-API-Key: <AGENT_SEARCH_API_KEY>`. In non-production, the API allows unauthenticated requests when the env var is unset.

## Versioning

- Consumers should read `version` and `generatedAt` before trusting content.
- When `version` changes, update this spec and any downstream parsers.
- Regenerate the index on every deploy (`npm run build` runs `prebuild`).

## Discovery

- `/llms.txt` — human/LLM-oriented guide and links
- `/SPEC.md` — this specification over HTTP
- `sitemap.xml` — lists `/agent-search-index.json`, `/llms.txt`, and `/SPEC.md`
