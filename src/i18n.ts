import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr-CA'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'fr-CA': '/fr',
    },
  },
  pathnames: {},
});

export type AppLocale = (typeof routing.locales)[number];
