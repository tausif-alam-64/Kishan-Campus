import { supabase } from "./supabaseClient";

export const signIn = async(email, password) => {
    if(!supabase) return {error: "Supabase not configured"};

    return supabase.auth.signInWithPassword({ email, password});
};

export const signUp = async (email, password, meta = {}) => {
    if(!supabase) return { error : "Supabase not Configured"};

    return supabase.auth.signUp({
        email,
        password,
        option: {data: meta},
    });
};