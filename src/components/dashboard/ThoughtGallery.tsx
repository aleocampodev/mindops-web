'use client'
import { motion } from 'framer-motion';
import { Calendar, History, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MissionStatus } from '@/lib/constants/mission-status';

interface Thought {
  id: string;
  friction_tag: string | null;
  friction_score?: number;
  summary_title: string;
  raw_content: string;
  status: string;
  created_at: string;
}

interface ThoughtGalleryProps {
  thoughts: Thought[];
  limit?: number;       // max items to show (undefined = all)
  showSeeAll?: boolean; // show "See all" link to /dashboard/history
}

function getScoreColor(score: number | undefined): string {
  if (!score) return 'bg-slate-100 text-slate-400';
  if (score >= 70) return 'bg-rose-100 text-rose-600';
  if (score >= 50) return 'bg-amber-100 text-amber-600';
  if (score >= 30) return 'bg-indigo-100 text-indigo-600';
  return 'bg-emerald-100 text-emerald-600';
}

export function ThoughtGallery({ thoughts, limit, showSeeAll = false }: ThoughtGalleryProps) {
  const t = useTranslations('Dashboard');
  // Show only committed (released) thoughts in the history gallery
  const history = thoughts.filter(t => t.status === MissionStatus.COMPLETED);

  if (history.length === 0) return null;

  const display = limit ? history.slice(0, limit) : history;
  const hasMore = limit ? history.length > limit : false;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
            <History size={18} aria-hidden="true" />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            {t('releasedThoughts')}
          </h3>
        </div>
        {(showSeeAll || hasMore) ? (
          <Link
            href="/dashboard/history"
            className="flex items-center gap-1.5 text-xs font-black text-indigo-500 uppercase tracking-wider hover:text-indigo-700 transition-colors"
          >
            {t('seeAll')}
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {display.map((t) => (
          <ThoughtCard key={t.id} thought={t} />
        ))}
      </div>
    </section>
  );
}

// ── Sub-component (composition pattern) ─────────────────────

function ThoughtCard({ thought: t }: { thought: Thought }) {
  const translations = useTranslations('Dashboard');
  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${getScoreColor(t.friction_score)}`}>
            {t.friction_tag ?? translations('processedTag')}
          </span>
          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
            <Calendar size={10} aria-hidden="true" />
            {new Date(t.created_at).toLocaleDateString(translations.raw('locale') === 'es' ? 'es-ES' : 'en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>

        <h4 className="font-black text-slate-900 text-base leading-tight mb-3 tracking-tight">
          {t.summary_title}
        </h4>

        <p className="text-slate-400 text-sm italic line-clamp-3 group-hover:line-clamp-none transition-all leading-relaxed">
          &ldquo;{t.raw_content}&rdquo;
        </p>
      </div>

      {t.friction_score != null ? (
        <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            {translations('friction')}
          </span>
          <span className={`text-lg font-black italic tabular-nums ${
            t.friction_score >= 70 ? 'text-rose-500'
              : t.friction_score >= 50 ? 'text-amber-500'
              : t.friction_score >= 30 ? 'text-indigo-500'
              : 'text-emerald-500'
          }`}>
            {t.friction_score}
          </span>
        </div>
      ) : null}
    </motion.div>
  );
}
