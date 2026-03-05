import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
    nombre_pagina: 'Aura Healing',
    logo_url: '/logo.png',
    hero_titulo: 'Elevate Your Vibrational Spirit',
    hero_subtitulo: 'Innovative holistic courses for modern wellness.',
    esquema_colores: '1',
    contacto: {
        email: 'hola@aura-healing.com',
        telefono: '+54 9 11 1234-5678',
        direccion: 'Buenos Aires, Argentina'
    },
    redes: { instagram: '', facebook: '', twitter: '', youtube: '' }
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('configuracion')
                .select('*')
                .eq('id', 'general')
                .single();
            if (data && !error) setSettings(data);
            setLoading(false);
        };
        fetchSettings();

        // Real-time subscription
        const channel = supabase
            .channel('configuracion-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'configuracion',
                filter: 'id=eq.general',
            }, (payload) => {
                if (payload.new) setSettings(payload.new);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {!loading && children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
