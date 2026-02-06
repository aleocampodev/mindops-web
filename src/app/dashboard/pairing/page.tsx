import { createClient } from '@/utils/supabase/server'
import { generatePairingCode } from './actions'
import { Heart, Send, Sparkles, RefreshCw, Smartphone } from 'lucide-react'
import { redirect } from 'next/navigation'
import {RealtimeRedirect} from '@/components/auth/RealtimeRedirect'
import { PairingTimer } from '@/components/dashboard/PairingTimer'

export default async function PairingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.telegram_id) redirect('/dashboard')

  let currentCode = profile?.pairing_code
  let currentExpiresAt = profile?.pairing_code_expires_at

  // Lógica Automática: Si no tiene código, lo generamos en el momento (Server-side)
  if (!currentCode) {
    const autoCode = Math.floor(100000 + (Math.random() * 900000)).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)
    const expiresAtStr = expiresAt.toISOString()

    await supabase.from('profiles').upsert({ 
      id: user.id, 
      pairing_code: autoCode,
      pairing_code_expires_at: expiresAtStr
    }, { onConflict: 'id' })
    
    currentCode = autoCode
    currentExpiresAt = expiresAtStr
  }

  const userName = profile?.first_name || user.user_metadata.full_name?.split(' ')[0] || 'Ale'

  return (
    <main className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
      <RealtimeRedirect userId={user.id} />
      <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-100/60 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-fuchsia-100/40 blur-[140px] rounded-full" />

      <div className="max-w-xl w-full z-10">
        <div className="bg-white/90 backdrop-blur-3xl border border-white p-14 md:p-16 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.12)] text-center relative overflow-hidden">
          <header className="mb-14">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200">
              <Heart size={44} className="text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase italic leading-none mb-4">Conectar mi Espacio</h1>
            <p className="text-slate-500 font-medium text-xl">Hola, <span className="text-indigo-600 font-bold">{userName}</span>. <br/>Sincroniza tus oídos de Telegram.</p>
          </header>

          <section className="bg-slate-50/80 rounded-[3.5rem] p-12 border border-slate-100 shadow-inner relative group">
             <div className="flex items-center justify-center gap-3 mb-8 opacity-40">
                <Sparkles size={20} className="text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-[0.4em]">Llave de Identidad</span>
             </div>
             <div className="text-7xl font-mono font-black tracking-[0.2em] text-slate-900 mb-6 py-6 border-y border-slate-200/50">
                {currentCode}
             </div>

             {currentExpiresAt && (
                <div className="mb-12">
                   <PairingTimer expiresAt={currentExpiresAt} />
                </div>
             )}

             <form action={generatePairingCode}>
                <button type="submit" className="cursor-pointer flex items-center gap-4 mx-auto bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-sm hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">
                  <RefreshCw size={18} /> SOLICITAR NUEVO CÓDIGO
                </button>
             </form>
          </section>

          <div className="mt-14">
            <div className="p-10 bg-indigo-600 rounded-[3.5rem] text-left shadow-2xl shadow-indigo-200 relative overflow-hidden group border border-white/20">
               <div className="relative z-10 text-white">
                 <div className="flex items-center gap-3 mb-6 font-black uppercase tracking-widest">
                    <Smartphone size={24} /> <span className="text-sm">Instrucción</span>
                 </div>
                 <p className="text-white text-lg font-medium leading-relaxed mb-8 opacity-90">Envía este mensaje exacto a tu bot:</p>
                 <div className=" bg-white/10 backdrop-blur-xl p-7 rounded-3xl border border-white/20 text-white font-mono text-2xl font-black text-center hover:bg-white/20 transition-all select-all shadow-inner">
                    /vincular {currentCode}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}