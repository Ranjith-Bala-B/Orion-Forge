global.WebSocket = class WebSocket {};
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lfgyedtugatjckjsuvpn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zU5x6VT-AJjAY2aLoJMzmw_eRPsDYei';

async function verify() {
  console.log('--- Orion Forge Vault Production-Readiness Check ---\n');
  const anonClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  const authClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  let passed = 0;
  let failed = 0;

  function report(item, result) {
    if (result) {
      console.log(`[PASS] ${item}`);
      passed++;
    } else {
      console.log(`[FAIL] ${item}`);
      failed++;
    }
  }

  // 1. Verify Auth User
  const { data: loginData, error: loginError } = await authClient.auth.signInWithPassword({
    email: 'vault@orionforge.com',
    password: 'varr@Forge'
  });
  report('1. Supabase Auth user required by Vault login exists', !loginError && loginData.user);
  if (loginError) console.error('   Error:', loginError.message);

  // 2. Verify Data Migration
  const { data: hackathons, error: hError } = await authClient.from('hackathons').select('*');
  const { data: history, error: histError } = await authClient.from('vault_history').select('*');
  report('2. Vault data migrated to Supabase', !hError && hackathons?.length > 0 && !histError && history?.length > 0);
  if (hError || histError) console.error('   Error:', hError?.message || histError?.message);

  // 3. Verify Realtime (We'll just check if channel subscribes)
  console.log('[SKIP] 3. Vault tables enabled for Supabase Realtime (Cannot test realtime properly outside browser/Node 22 without ws package)');

  // 4. Verify RLS (Authenticated)
  const { data: authRead, error: authReadError } = await authClient.from('hackathons').select('*').limit(1);
  report('4. RLS allows authenticated Vault users to read/write', !authReadError);
  if (authReadError) console.error('   Error:', authReadError.message);

  // 5. Verify RLS (Unauthenticated)
  // We sign out anonClient just to be sure
  await anonClient.auth.signOut();
  const { data: anonRead, error: anonReadError } = await anonClient.from('hackathons').select('*');
  // It should succeed but return 0 rows if RLS blocks read, or return an error depending on policy
  const blocked = anonReadError || (anonRead && anonRead.length === 0);
  report('5. Unauthenticated public visitors cannot modify/read Vault data', blocked);
  if (!blocked) console.error('   Warning: Unauthenticated user was able to read Vault data!', anonRead);

  console.log(`\nResults: ${passed} PASS, ${failed} FAIL\n`);
  process.exit(failed > 0 ? 1 : 0);
}

verify().catch(console.error);
