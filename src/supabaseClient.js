import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oexcszpcdlquaagugral.supabase.co'; // Deine Projekt-URL aus Supabase Dashboard
const supabaseAnonKey = 'sb_publishable_1S7xMctsG4SiIYjVrPn1fw_avmWjpSQ';   // Dein public API Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);