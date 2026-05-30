import type { Locale } from './cms';

export async function getCurrentLocale(): Promise<Locale> {
  return 'en';
}
