import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase-Schlüssel fehlen!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
redirectTo: 'https://community-app1-34hzhimmf-ronnyhurth-7948s-projects.vercel.app/'
