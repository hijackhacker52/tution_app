import { createClient } from '@supabase/supabase-js';

// Supabase Client Initialization with Dynamic / Fallback Safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  // Graceful fallback for offline / mock mode
  console.warn('Supabase initialization fallback:', e);
  supabaseClient = null;
}

export const supabase = supabaseClient;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseClient);
};
