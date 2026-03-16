import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { getDbTranslations } from '@/lib/i18n/loader';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  const localMessages = (await import(`../../messages/${locale}.json`)).default;
  const dbMessages = await getDbTranslations(locale);

  return {
    locale,
    messages: {
      ...localMessages,
      ...dbMessages
    }
  };
});
