// Supabase Client Initialization with Dynamic / Fallback Safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;

try {
  // Dynamically create client if keys are present and module exists
  if (supabaseUrl && supabaseAnonKey) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  // Graceful fallback for offline / mock mode
  supabaseClient = null;
}

export const supabase = supabaseClient;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseClient);
};
