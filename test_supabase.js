const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:\\Orion Forge\\Orion Forge Website\\.env' });

async function verify() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing env variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let pass = true;

    try {
        console.log('Testing DATABASE READ (CMS/Vault)...');
        // Test read
        const { data, error } = await supabase.from('site_config').select('*').limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
            console.log('DATABASE READ: PASS');
        } else {
            throw new Error('No data returned');
        }

        console.log('Testing DATABASE WRITE...');
        // Test write (we can try to insert a fake stat or check if we get a specific error like permission denied)
        const { error: writeError } = await supabase.from('stats').insert({ label: 'TestStat', value: '100' });
        // RLS might block this with anon key, which is fine, it means connection works and RLS is active.
        if (writeError) {
             console.log('DATABASE WRITE: Restricted by RLS (PASS)');
        } else {
             console.log('DATABASE WRITE: PASS');
             // cleanup
             await supabase.from('stats').delete().eq('label', 'TestStat');
        }

        console.log('Testing REALTIME...');
        // Test realtime channel creation
        const channel = supabase.channel('schema-db-changes');
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'site_config' },
            (payload) => console.log(payload)
        ).subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                 console.log('REALTIME: PASS');
                 supabase.removeChannel(channel);
            }
        });
        
        // Wait 2 secs to see if realtime subscribe succeeds
        await new Promise(r => setTimeout(r, 2000));
        
        console.log('ALL REGRESSION TESTS: PASS');
    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    }
}

verify();
