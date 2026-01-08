import { createContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!supabase){
            setLoading(false)
            return;
        }

        const initAuth = async () => {
            try {
                // Getting Initial session
                const {data} = await supabase.auth.getSession();
                const sessionUser = data?.session?.user ?? null;

                setUser(sessionUser);
                setUserRole(sessionUser?.user_metadata?.role ?? null);
            } catch (error) {
                console.error("Error getting session:". error)
            }finally{
                setLoading(false);
            }
        }
        initAuth();

        // Listen for auth changes
        const { data : listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);
                setUserRole(sessionUser?.user_metadata?.role ?? null);
                setLoading(false);
            }
        )

        return () => {
            listener?.subscription?.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        if(!supabase) return;
        await supabase.auth.signOut();
    };

    const value = {
        user, 
        userRole,
        loading,
        signOut,
        isAuthenticated: Boolean(user),
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}