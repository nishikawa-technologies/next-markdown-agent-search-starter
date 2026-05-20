export function formatNewsDate(date: Date, localeCode: string): string {
  const locale = localeCode === 'ja' ? 'ja-JP' : 'en-US';

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}
