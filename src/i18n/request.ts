import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { getDbTranslations } from '@/lib/i18n/loader';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // 1. Priority: Internal sync header from middleware
  // 2. Fallback: NEXT_LOCALE cookie
  // 3. Last fallback: 'en'
  const locale = headersList.get('x-next-intl-locale') || 
                 cookieStore.get('NEXT_LOCALE')?.value || 
                 'en';

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
