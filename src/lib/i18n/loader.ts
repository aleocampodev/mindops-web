import { createClient } from '@/utils/supabase/server';

// Supported locale columns in mindops.translations table
const LOCALE_COLUMNS: Record<string, string> = { en: 'en', es: 'es' };

export async function getDbTranslations(locale: string) {
  const supabase = await createClient();

  // The translations table has columns: key, en, es
  // We select the column matching the requested locale
  const col = LOCALE_COLUMNS[locale] ?? 'en';

  const { data, error } = await supabase
    .schema('mindops')
    .from('translations')
    .select(`key, ${col}`);

  if (error || !data) {
    console.error('Error fetching translations from DB:', error);
    return {};
  }

  // Convert to a next-intl compatible messages object
  // supporting nested keys if stored as 'parent.child'
  const messages: Record<string, unknown> = {};
  data.forEach((item: Record<string, string>) => {
    const key = item.key;
    const value = item[col];
    if (!key || value == null) return;

    const parts = key.split('.');
    let current = messages;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        (current as Record<string, unknown>)[part] = value;
      } else {
        if (typeof current[part] !== 'object') {
          (current as Record<string, unknown>)[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
    }
  });

  return messages;
}
