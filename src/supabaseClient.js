import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase configuration missing. Add a root .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

const client = globalThis.__supabase_client ?? createClient(supabaseUrl, supabaseAnonKey);
globalThis.__supabase_client = client;

export const supabase = client;