'use client'

import { useState, useEffect, useCallback } from 'react'
import { Timer, AlertCircle } from 'lucide-react'

interface PairingTimerProps {
  expiresAt: string
  onExpire?: () => void
}

export function PairingTimer({ expiresAt, onExpire }: PairingTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [progress, setProgress] = useState<number>(100)

  const calculateTimeLeft = useCallback(() => {
    const expiration = new Date(expiresAt).getTime()
    const now = new Date().getTime()
    const diff = expiration - now
    return Math.max(0, diff)
  }, [expiresAt])

  useEffect(() => {
    const initialDiff = calculateTimeLeft()
    const totalDuration = 10 * 60 * 1000 // 10 minutes in ms

    const updateTimer = () => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      const newProgress = (remaining / totalDuration) * 100
      setProgress(Math.min(100, Math.max(0, newProgress)))

      if (remaining <= 0 && onExpire) {
        onExpire()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [calculateTimeLeft, onExpire])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isExpiringSoon = progress < 20

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${isExpiringSoon ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
          <Timer size={12} />
          <span>EXPIRA EN: {formatTime(timeLeft)}</span>
        </div>
        {isExpiringSoon && (
          <div className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase tracking-tighter">
            <AlertCircle size={10} />
            Acción requerida
          </div>
        )}
      </div>
      
      {/* Thinner, wider Thermometer */}
      <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear rounded-full ${
            progress > 50 
              ? 'bg-gradient-to-r from-emerald-400 via-indigo-500 to-violet-600 shadow-[0_0_10px_-2px_rgba(99,102,241,0.4)]' 
              : progress > 20 
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_10px_-2px_rgba(245,158,11,0.4)]' 
                : 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 shadow-[0_0_10px_-2px_rgba(225,29,72,0.5)] animate-pulse'
          }`}
          style={{ width: `${progress}%` }}
        >
          {/* Shine effect - more subtle for thin bar */}
          <div className="absolute top-0 left-0 w-full h-full bg-white/10" />
          
          {/* Animated Glow on tip - smaller for thin bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-full bg-white/40 blur-sm" />
        </div>
      </div>
      
      <p className="mt-2 text-[9px] font-medium text-slate-300 uppercase tracking-[0.3em] text-center">
        Sincronización de seguridad activa
      </p>
    </div>
  )
}
