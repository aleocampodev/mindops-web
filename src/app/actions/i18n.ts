'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function setUserLanguage(locale: string) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // 1. Update cookie for immediate UI response
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  // 2. Update database if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .schema('mindops')
      .from('profiles')
      .update({ language: locale })
      .eq('id', user.id);
  }

  // 3. Optional: Sync with telegram_sessions if we have a session ID
  const sessionId = cookieStore.get('tg_session_id')?.value;
  if (!user && sessionId) {
    await supabase
      .schema('mindops')
      .from('telegram_sessions')
      .update({ language: locale })
      .eq('id', sessionId);
  }

  return { success: true };
}
