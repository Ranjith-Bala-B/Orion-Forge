const { createClient } = require('@supabase/supabase-js'); 
const ws = require('ws');
require('dotenv').config(); 
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { realtime: { transport: ws } }); 
async function run() { 
  const { data } = await supabase.from('unstop_events').select('raw_data').limit(1); 
  console.log(JSON.stringify(data, null, 2)); 
} 
run();
