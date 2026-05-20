import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

/** Organization 構造化データ（トップレベル） */
export function OrganizationJsonLd() {
  const base = getBaseUrl().trim().replace(/\/$/, '');
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': AppConfig.name,
    'alternateName': ['サンプルコーポレーション', AppConfig.name],
    'url': `${base}/`,
    'logo': `${base}/logo.png`,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- JSON-LD is static
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
