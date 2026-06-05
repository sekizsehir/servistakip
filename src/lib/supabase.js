import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Supabase env değişkenleri eksik! .env.local dosyasını kontrol edin.')
}

export const supabase = createClient(url, key)
