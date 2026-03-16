'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { setUserLanguage } from '@/app/actions/i18n';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  async function onLanguageChange(newLocale: string) {
    startTransition(async () => {
      await setUserLanguage(newLocale);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2 text-xs font-bold">
      <button
        onClick={() => onLanguageChange('en')}
        disabled={isPending || locale === 'en'}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'en' 
            ? 'bg-slate-900 text-white' 
            : 'text-slate-400 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('es')}
        disabled={isPending || locale === 'es'}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'es' 
            ? 'bg-slate-900 text-white' 
            : 'text-slate-400 hover:text-slate-900'
        }`}
      >
        ES
      </button>
    </div>
  );
}
