import { supabase } from '/backend/database.js';

const {
    data: { session }
} = await supabase.auth.getSession();

if (!session) {
    window.location.replace('/index.html');
}