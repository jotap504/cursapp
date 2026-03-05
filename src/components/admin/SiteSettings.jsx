import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { Save, Palette, Globe, MessageSquare, Share2 } from 'lucide-react';

export default function SiteSettings() {
    const [settings, setSettings] = useState({
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
        redes: {
            instagram: '',
            facebook: '',
            twitter: '',
            youtube: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('configuracion')
                    .select('*')
                    .eq('id', 'general')
                    .single();
                if (data && !error) setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('configuracion')
                .upsert({ id: 'general', ...settings });
            if (error) throw error;
            alert('Configuración guardada correctamente');
        } catch (error) {
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Cargando configuración...</div>;

    return (
        <div className="flex flex-col gap-8 pb-20" data-theme={settings.esquema_colores}>
            <div className="flex justify-between items-center text-primary transition-colors">
                <header>
                    <h1 className="text-3xl font-black text-slate-100 tracking-tighter">Configuración Web</h1>
                    <p className="text-slate-400 font-medium italic">Personaliza la apariencia y datos globales de tu plataforma.</p>
                </header>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Branding */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-primary" size={24} />
                        <h2 className="text-xl font-black text-slate-100">Identidad Digital</h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nombre de la Página</label>
                        <input
                            type="text"
                            value={settings.nombre_pagina}
                            onChange={(e) => setSettings({ ...settings, nombre_pagina: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Logo URL</label>
                        <input
                            type="text"
                            value={settings.logo_url}
                            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold"
                        />
                    </div>
                </section>

                {/* Color Schemes */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Palette className="text-primary" size={24} />
                        <h2 className="text-xl font-black text-slate-100">Esquema de Colores</h2>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {[
                            { id: '1', bg: '#1a120b', color: '#d97706', label: '🌿 Tierra' },
                            { id: '2', bg: '#020c1b', color: '#06b6d4', label: '🌊 Océano' },
                            { id: '3', bg: '#031a0e', color: '#10b981', label: '🌿 Bosque' },
                            { id: '4', bg: '#160508', color: '#f43f5e', label: '🔴 Noir' },
                            { id: '5', bg: '#f8fafc', color: '#64748b', label: '🤍 Pearl' }
                        ].map((scheme) => (
                            <button
                                key={scheme.id}
                                onClick={() => setSettings({ ...settings, esquema_colores: scheme.id })}
                                className={`group relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${settings.esquema_colores === scheme.id
                                    ? 'border-white/60 scale-105 shadow-lg'
                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                    }`}
                                style={{ backgroundColor: settings.esquema_colores === scheme.id ? scheme.bg : undefined }}
                            >
                                <div
                                    className="w-8 h-8 rounded-full shadow-inner border-2 border-white/20"
                                    style={{ backgroundColor: scheme.color }}
                                />
                                <span className="text-[9px] font-black text-white/70 whitespace-nowrap">{scheme.label}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic text-center mt-4">
                        Selecciona un esquema para cambiar los tonos principales de toda la web.
                    </p>
                </section>

                {/* Hero Content */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="text-primary" size={24} />
                        <h2 className="text-xl font-black text-slate-100">Textos de Bienvenida (Hero)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Título Principal</label>
                            <textarea
                                value={settings.hero_titulo}
                                onChange={(e) => setSettings({ ...settings, hero_titulo: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold h-32"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Subtítulo</label>
                            <textarea
                                value={settings.hero_subtitulo}
                                onChange={(e) => setSettings({ ...settings, hero_subtitulo: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold h-32"
                            />
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Share2 className="text-primary" size={24} />
                        <h2 className="text-xl font-black text-slate-100">Redes Sociales y Pie de Página</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['instagram', 'facebook', 'twitter', 'youtube'].map((red) => (
                            <div key={red} className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 capitalize">{red}</label>
                                <input
                                    type="text"
                                    value={settings.redes[red] || ''}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        redes: { ...settings.redes, [red]: e.target.value }
                                    })}
                                    placeholder="https://"
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-primary font-bold text-xs"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
