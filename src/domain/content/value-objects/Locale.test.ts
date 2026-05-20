import { describe, expect, it } from 'vitest';
import { InvalidLocaleError, Locale } from './Locale';

describe('locale', () => {
  it('creates a locale from a supported code', () => {
    const locale = Locale.create('ja');

    expect(locale.code).toBe('ja');
  });

  it('rejects unsupported locale codes', () => {
    expect(() => Locale.create('fr')).toThrow(InvalidLocaleError);
  });

  it('compares locales by code', () => {
    const ja = Locale.create('ja');
    const same = Locale.create('ja');
    const en = Locale.create('en');

    expect(ja.equals(same)).toBe(true);
    expect(ja.equals(en)).toBe(false);
  });
});
