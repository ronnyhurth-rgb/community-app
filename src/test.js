import { createClient } from '@supabase/supabase-js';
const supabase = createClient('DEINE_URL', 'DEIN_KEY');

async function test() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log(data ? "ERFOLG: " + data.length : "FEHLER: " + error.message);
}
test();