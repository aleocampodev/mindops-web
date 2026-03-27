import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThoughtGallery } from '@/components/dashboard/ThoughtGallery';
import { MissionStatus } from '@/lib/constants/mission-status';
import { getTranslations } from 'next-intl/server';


export default async function HistoryPage() {
  const tDashboard = await getTranslations('Common');
  const tHistory = await getTranslations('History');
  const supabase = await createClient();


  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: thoughts } = await supabase
    .schema('mindops')
    .from('thoughts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[var(--color-surface,#FDFDFF)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
        {/* Back nav */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {tDashboard('backToDashboard')}
        </Link>


        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-black italic tracking-tight text-slate-900">
            {tHistory('title')}
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-2">
            {tHistory('description')}
          </p>
        </div>


        {/* Full gallery — no limit */}
        <ThoughtGallery thoughts={thoughts || []} />

        {/* Empty state if no committed thoughts */}
        {(!thoughts || thoughts.filter((t: any) => t.status === MissionStatus.COMPLETED).length === 0) ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">💭</p>
            <h2 className="text-xl font-black italic text-slate-300 mb-2">
              {tHistory('emptyTitle')}
            </h2>
            <p className="text-sm font-medium text-slate-300 max-w-md mx-auto">
              {tHistory('emptyDescription')}
            </p>
          </div>
        ) : null}

      </div>
    </main>
  );
}
