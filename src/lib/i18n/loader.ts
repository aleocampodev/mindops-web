import { createClient } from '@/utils/supabase/server';

export async function getDbTranslations(locale: string) {
  const supabase = await createClient();

  // Fetch translations from the 'mindops.translations' table
  // Assuming columns: key, language, value (or similar)
  const { data, error } = await supabase
    .schema('mindops')
    .from('translations')
    .select('key, value')
    .eq('language', locale);

  if (error || !data) {
    console.error('Error fetching translations from DB:', error);
    return {};
  }

  // Convert to a next-intl compatible messages object
  // supporting nested keys if stored as 'parent.child'
  const messages: Record<string, any> = {};
  data.forEach((item: { key: string, value: string }) => {
    const parts = item.key.split('.');
    let current = messages;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = item.value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  });

  return messages;
}
