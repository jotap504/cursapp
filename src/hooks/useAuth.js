import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) loadUserProfile(session.user);
            else setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) await loadUserProfile(session.user);
                else { setUser(null); setLoading(false); }
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    const loadUserProfile = async (authUser) => {
        try {
            const { data: profile } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', authUser.id)
                .maybeSingle();

            if (profile) {
                setUser({ ...authUser, ...profile });
            } else {
                const newProfile = {
                    id: authUser.id,
                    nombre: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
                    email: authUser.email,
                    foto: authUser.user_metadata?.avatar_url || null,
                    rol: 'estudiante',
                    cursos_comprados: [],
                };
                await supabase.from('usuarios').insert(newProfile);
                setUser({ ...authUser, ...newProfile });
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            setUser(authUser);
        } finally {
            setLoading(false);
        }
    };

    // ── Email / Password ──
    const login = async ({ email, password }) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const register = async ({ email, password, nombre }) => {
        const { error } = await supabase.auth.signUp({
            email, password,
            options: { data: { full_name: nombre } }
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const claimAdmin = async () => {
        if (!user) return false;
        const { error } = await supabase.from('usuarios').update({ rol: 'admin' }).eq('id', user.id);
        if (!error) { setUser({ ...user, rol: 'admin' }); return true; }
        return false;
    };

    return { user, loading, login, register, logout, isAdmin: user?.rol === 'admin', claimAdmin };
}
