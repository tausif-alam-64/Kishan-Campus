export const env = {
    supabaseUrl : import.meta.env.VITE_SUPABASE_URL || null,
    supabaseAnonKey : import.meta.env.VITE_SUPABASE_ANON_KEY || null,
    
    web3FormUrl : import.meta.env.VITE_WEB3FORM_URL,
    web3FormKey : import.meta.env.VITE_WEB3FORM_KEY || null,
}