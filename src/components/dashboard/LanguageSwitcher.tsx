'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { setUserLanguage } from '@/app/actions/i18n';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Common');

  async function onLanguageChange(newLocale: string) {
    startTransition(async () => {
      await setUserLanguage(newLocale);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3" role="group" aria-label={t('translate')}>
      <div className="flex items-center gap-2 text-slate-400">
        <Languages size={14} className="opacity-50" aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
          {t('translate')}
        </span>
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => onLanguageChange('en')}
          disabled={isPending || locale === 'en'}
          aria-label="English"
          aria-pressed={locale === 'en'}
          className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-tight transition-all ${
            locale === 'en' 
              ? 'bg-white text-slate-950 shadow-sm' 
              : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('es')}
          disabled={isPending || locale === 'es'}
          aria-label="Español"
          aria-pressed={locale === 'es'}
          className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-tight transition-all ${
            locale === 'es' 
              ? 'bg-white text-slate-950 shadow-sm' 
              : 'text-slate-400 hover:text-slate-900'
          }`}
        >
          ES
        </button>
      </div>
    </div>
  );
}
