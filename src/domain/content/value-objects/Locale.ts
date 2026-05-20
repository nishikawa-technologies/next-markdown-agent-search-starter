import { AppConfig } from '@/utils/AppConfig';

export class InvalidLocaleError extends Error {
  constructor(code: string) {
    super(`Unsupported locale: ${code}`);
    this.name = 'InvalidLocaleError';
  }
}

export class Locale {
  private constructor(readonly code: string) {}

  static create(code: string): Locale {
    if (!AppConfig.locales.includes(code)) {
      throw new InvalidLocaleError(code);
    }

    return new Locale(code);
  }

  equals(other: Locale): boolean {
    return this.code === other.code;
  }
}
