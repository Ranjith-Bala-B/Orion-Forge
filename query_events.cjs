const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false }, realtime: { transport: ws }});
async function run() { 
  const { data } = await supabase.from('unstop_events').select('title, event_type, status, source_updated_at').order('source_updated_at', { ascending: false }).limit(10); 
  console.log(JSON.stringify(data, null, 2)); 
} 
run();
