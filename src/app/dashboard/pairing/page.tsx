import { createClient } from '@/utils/supabase/server';
import { generatePairingCode } from './actions';
import { Heart, RefreshCw, Smartphone, ShieldCheck, CheckCircle, Send, BrainCircuit, Zap, Shield, Activity } from 'lucide-react';
import { redirect } from 'next/navigation';
import { RealtimeRedirect } from '@/components/auth/RealtimeRedirect';
import { PairingTimer } from '@/components/dashboard/PairingTimer';
import {
  getUserDisplayName,
  generatePairingCodeData,
  isPairingCodeExpired,
  isUserPaired,
  isUserPendingContact,
} from '@/lib/pairing/helpers';
import type { Profile } from '@/lib/pairing/types';

export default async function PairingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .schema('mindops')
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Error fetching profile:', profileError);
  }

  if (isUserPaired(profile)) {
    redirect('/dashboard');
  }

  const userName = getUserDisplayName(profile, user.user_metadata, user.email);

  // ── PENDING CONTACT VIEW ───────────────────────────────
  if (isUserPendingContact(profile)) {
    return (
      <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
        <RealtimeRedirect userId={user.id} />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left — Brand panel */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500">
                  <BrainCircuit className="text-white" size={18} />
                </div>
                <span className="text-lg font-black tracking-tight">
                  <span className="text-white">MIND</span>
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">OPS</span>
                </span>
              </div>
            </div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl font-black italic tracking-tight leading-[1.05]">
                Almost<br />there.
              </h2>
              <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">
                Your code was accepted. Share your contact in Telegram to complete the connection.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-6 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><CheckCircle size={12} /> Code verified</span>
              <span className="flex items-center gap-2"><Send size={12} /> Contact pending</span>
            </div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
          </div>

          {/* Right — Action panel */}
          <div className="flex flex-col items-center justify-center p-8 md:p-16 relative">
            <div className="w-full max-w-lg space-y-10">
              <div className="text-center lg:text-left">
                <div className="lg:hidden mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500">
                      <BrainCircuit className="text-white" size={18} />
                    </div>
                    <span className="text-lg font-black tracking-tight">
                      <span className="text-white">MIND</span>
                      <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">OPS</span>
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  <CheckCircle size={12} /> Code Accepted
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tight leading-none mb-4">
                  Share your<br />contact
                </h1>
                <p className="text-white/40 text-lg font-medium leading-relaxed">
                  Great, <span className="text-emerald-400 font-bold">{userName}</span>! One last step.
                </p>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-white/30">
                  <Smartphone size={18} />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">In Telegram</span>
                </div>

                <p className="text-white/60 text-sm font-medium leading-relaxed">
                  Open the MindOps bot and tap the button to share your phone contact:
                </p>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-emerald-400 font-black text-xl text-center">
                  📱 Share Contact
                </div>

                <p className="text-white/20 text-xs font-medium text-center">
                  This page will update automatically once your contact is received.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── NORMAL PAIRING FLOW ───────────────────────────────
  const pairingData = await ensureValidPairingCode(supabase, user, profile);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <RealtimeRedirect userId={user.id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left — Brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-600">
                <BrainCircuit className="text-white" size={18} />
              </div>
              <span className="text-lg font-black tracking-tight">
                <span className="text-white">MIND</span>
                <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">OPS</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl font-black italic tracking-tight leading-[1.05]">
              Connect<br />your mind.
            </h2>
            <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">
              Link your Telegram to start tracking your cognitive friction and take control of your mental clarity.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Activity, label: 'Track friction', desc: 'Real-time cognitive load' },
                { icon: Zap, label: 'AI insights', desc: 'Strategic perspective' },
                { icon: Shield, label: 'Protection', desc: 'System overload detection' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 space-y-2">
                  <Icon size={16} className="text-indigo-400" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/60">{label}</p>
                  <p className="text-[10px] text-white/25 font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            <span>Mental Performance Engineering</span>
          </div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Right — Code panel */}
        <div className="flex flex-col items-center justify-center p-8 md:p-16 relative">
          <div className="w-full max-w-lg space-y-10">
            {/* Header */}
            <div className="text-center lg:text-left">
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600">
                    <BrainCircuit className="text-white" size={18} />
                  </div>
                  <span className="text-lg font-black tracking-tight">
                    <span className="text-white">MIND</span>
                    <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">OPS</span>
                  </span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tight leading-none mb-4">
                Connect<br />my space
              </h1>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Hello, <span className="text-indigo-400 font-bold">{userName}</span>. Link your account to manage your cognitive load.
              </p>
            </div>

            {/* Code card */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 md:p-10 space-y-8">
              <div className="flex items-center justify-center gap-3 text-white/30">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Unique Security Key</span>
              </div>

              <div className="text-center">
                <div className="text-7xl md:text-8xl font-mono font-black tracking-[0.15em] text-white py-6 border-y border-white/[0.06]">
                  {pairingData.code}
                </div>
              </div>

              <div className="space-y-6">
                <PairingTimer expiresAt={pairingData.expiresAt} />

                <form action={async (formData: FormData) => {
                  'use server';
                  await generatePairingCode();
                }} className="flex justify-center">
                  <button
                    type="submit"
                    className="cursor-pointer flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                  >
                    <RefreshCw size={14} />
                    Request new code
                  </button>
                </form>
              </div>
            </div>

            {/* Telegram instruction */}
            <div className="bg-indigo-600 rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">In Telegram</span>
                </div>

                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  Open your MindOps bot and send this exact message:
                </p>

                <div className="cursor-pointer bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 font-mono text-xl font-black text-center hover:bg-white/20 transition-all select-all">
                  /vincular {pairingData.code}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

async function ensureValidPairingCode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; user_metadata: Record<string, string>; email?: string },
  profile: Profile | null
) {
  const currentCode = profile?.pairing_code;
  const currentExpiresAt = profile?.pairing_code_expires_at;

  if (currentCode && !isPairingCodeExpired(currentExpiresAt)) {
    return {
      code: currentCode,
      expiresAt: currentExpiresAt!,
      profile,
    };
  }

  const { code, expiresAt } = generatePairingCodeData();
  const userName = getUserDisplayName(profile, user.user_metadata, user.email);

  const { data: updatedProfile, error: upsertError } = await supabase
    .schema('mindops')
    .from('profiles')
    .upsert(
      {
        id: user.id,
        pairing_code: code,
        pairing_code_expires_at: expiresAt,
        first_name: profile?.first_name || userName,
        onboarding_state: 'PENDING_LINK',
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (upsertError) {
    console.error('Error upserting pairing code:', upsertError);
  }

  return {
    code,
    expiresAt,
    profile: updatedProfile || profile,
  };
}