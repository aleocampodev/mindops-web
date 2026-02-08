import { createClient } from '@/utils/supabase/server'
import { generatePairingCode } from './actions'
import { Heart, Send, Sparkles, RefreshCw, Smartphone, ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { RealtimeRedirect } from '@/components/auth/RealtimeRedirect'
import { PairingTimer } from '@/components/dashboard/PairingTimer'

export default async function PairingPage() {
  const supabase = await createClient()
  
  // 1. Verificación de sesión de Google
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Intentar traer el perfil
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. 🧠 LÓGICA DE ACTIVACIÓN: Si Ale ya vinculó todo, al Dashboard.
  // Si le falta el telegram_id o el phone_number, se queda aquí.
  if (profile?.telegram_id && profile?.phone_number) {
    redirect('/dashboard')
  }

  // 4. 🛠 REGISTRO PROACTIVO: Si no hay fila en 'profiles', la creamos AHORA.
  // Esto evita las filas vacías al hacer login. La fila nace solo cuando Ale quiere vincularse.
  let currentCode = profile?.pairing_code
  let currentExpiresAt = profile?.pairing_code_expires_at

  if (!currentCode) {
    const autoCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)
    const expiresAtStr = expiresAt.toISOString()

    const { data: newProfile } = await supabase.from('profiles').upsert({ 
      id: user.id, 
      pairing_code: autoCode,
      pairing_code_expires_at: expiresAtStr,
      first_name: user.user_metadata.full_name?.split(' ')[0] || 'Ale'
    }, { onConflict: 'id' }).select().single()
    
    currentCode = autoCode
    currentExpiresAt = expiresAtStr
  }

  const userName = profile?.first_name || user.user_metadata.full_name?.split(' ')[0] || 'Ale'

  return (
    <main className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6 relative overflow-hidden text-slate-900 selection:bg-indigo-100">
      {/* Observador en tiempo real para redirigir cuando n8n termine el trabajo */}
      <RealtimeRedirect userId={user.id} />

      {/* Fondos Dinámicos Vivid */}
      <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-100/60 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-fuchsia-100/40 blur-[140px] rounded-full" />

      <div className="max-w-xl w-full z-10">
        <div className="bg-white/90 backdrop-blur-3xl border border-white p-14 md:p-16 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.12)] text-center relative overflow-hidden">
          
          <header className="mb-14">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200">
              <Heart size={44} className="text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase italic leading-none mb-4">
              Conectar <br/> mi Espacio
            </h1>
            <p className="text-slate-500 font-medium text-xl leading-relaxed">
              Hola, <span className="text-indigo-600 font-bold">{userName}</span>. <br/>
              Vincula tu cuenta para gestionar tu carga cognitiva.
            </p>
          </header>

          <section className="bg-slate-50/80 rounded-[3.5rem] p-12 border border-slate-100 shadow-inner relative">
             <div className="flex items-center justify-center gap-3 mb-8 opacity-40">
                <ShieldCheck size={18} className="text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-[0.4em]">Llave de Seguridad Única</span>
             </div>
             
             <div className="text-7xl font-mono font-black tracking-[0.2em] text-slate-900 mb-6 py-6 border-y border-slate-200/50 drop-shadow-sm">
                {currentCode}
             </div>

             {currentExpiresAt && (
                <div className="mb-10">
                   <PairingTimer expiresAt={currentExpiresAt} />
                </div>
             )}

             <form action={generatePairingCode}>
                <button 
                  type="submit" 
                  className="cursor-pointer flex items-center gap-4 mx-auto bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-sm hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
                >
                  <RefreshCw size={18} />
                  SOLICITAR NUEVO CÓDIGO
                </button>
             </form>
          </section>

          <div className="mt-14">
            <div className="p-10 bg-indigo-600 rounded-[3.5rem] text-left shadow-2xl shadow-indigo-200 relative overflow-hidden group">
               <div className="relative z-10 text-white">
                 <div className="flex items-center gap-3 mb-6 font-black">
                    <Smartphone size={24} />
                    <span className="text-sm font-black uppercase tracking-widest text-white">Instrucción para Telegram</span>
                 </div>
                 <p className="text-white text-lg font-medium leading-relaxed mb-8 opacity-90">
                    Abre tu bot de MindOps y envía este mensaje exacto:
                 </p>
                 <div className="cursor-pointer bg-white/10 backdrop-blur-xl p-7 rounded-3xl border border-white/20 text-white font-mono text-2xl font-black text-center hover:bg-white/20 transition-all select-all shadow-inner">
                    /vincular {currentCode}
                 </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-10 text-[11px] font-black tracking-[0.6em] uppercase">
          MindOps // Gestión de Carga Cognitiva
        </p>
      </div>
    </main>
  )
}