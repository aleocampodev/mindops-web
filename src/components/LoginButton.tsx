'use client'
import { useState } from 'react' // 🧠 Para el estado de la UI (no de los datos)
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/auth/callback` 
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Error de autenticación:', error)
      setIsLoading(false)
      alert("Error al conectar con Google. Reintenta.")
    }
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogin} 
      disabled={isLoading}
      className={`
        cursor-pointer relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl
        ${isLoading 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-white text-black hover:bg-indigo-600 hover:text-white shadow-indigo-200'
        }
      `}
    >
      {/* Efecto de escaneo neón (solo si no está cargando) */}
      {!isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full animate-scan" />
      )}

      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          SINCRONIZANDO...
        </>
      ) : (
        <>
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
          ENTRAR CON GOOGLE
        </>
      )}
    </motion.button>
  )
}