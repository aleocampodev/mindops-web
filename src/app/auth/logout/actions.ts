'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  
  // 1. Cerramos sesión en Supabase (esto invalida el JWT)
  await supabase.auth.signOut()
  
  // 2. Redirigimos al Home limpiando el estado
  redirect('/')
}