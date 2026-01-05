import { createClient } from "@supabase/supabase-js"
import {env} from "@/config/env"

let supabase = null;
if(env.supabaseUrl && env.supabaseAnonKey){
    supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
}else{
    console.warn("Supabase not configured. Running in fronted-only mode.")
}

export { supabase };