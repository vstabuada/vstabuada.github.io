import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://shirfddotjoqdlztfsxt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BnQTVN3BDqzKy-vdgZCZ3A_q1AogoIl';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);