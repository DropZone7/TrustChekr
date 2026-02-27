import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n';

import en from '../../messages/en.json';
import fr from '../../messages/fr.json';

const messageMap: Record<string, any> = { en, 'fr-CA': fr };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messageMap[locale] ?? en,
  };
});
