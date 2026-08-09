import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lfgyedtugatjckjsuvpn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zU5x6VT-AJjAY2aLoJMzmw_eRPsDYei';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function signup() {
  const { data, error } = await supabase.auth.signUp({
    email: 'vault@orionforge.com',
    password: 'varr@Forge',
  });
  if (error) {
    console.error('Sign up failed:', error);
  } else {
    console.log('User signed up successfully:', data.user?.id);
  }
}

signup();
