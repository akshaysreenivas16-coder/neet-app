import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY,
    {
        auth: {
            detectSessionInUrl: true,
            persistSession: true,
            autoRefreshToken: true
        }
    }
)

export default supabase