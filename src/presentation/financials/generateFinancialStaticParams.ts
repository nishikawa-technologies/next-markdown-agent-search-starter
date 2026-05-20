import { Locale } from '@/domain/content/value-objects/Locale';
import { financialStatementRepository } from '@/infrastructure/financials/financialsModule';
import { AppConfig } from '@/utils/AppConfig';

export async function generateFinancialStatementStaticParams() {
  const params: { locale: string; period: string }[] = [];

  for (const localeCode of AppConfig.locales) {
    const locale = Locale.create(localeCode);
    const statements = await financialStatementRepository.listByLocale(locale);

    for (const statement of statements) {
      params.push({
        locale: localeCode,
        period: statement.period.value,
      });
    }
  }

  return params;
}
