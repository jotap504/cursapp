import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Send, Mail, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function Footer() {
    const { settings } = useSettings();

    return (
        <footer className="bg-background-dark pt-20 pb-20 md:pb-12 border-t border-white/5 px-4 md:px-12 overflow-hidden relative">
            {/* Decorative Blur */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">

                {/* Brand Column */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                            {settings.logo_url ? (
                                <img src={settings.logo_url} alt="logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-white text-xl fill-1">auto_awesome</span>
                            )}
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-100 italic">{settings.nombre_pagina}</h1>
                    </Link>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Plataforma líder en educación holística y bienestar consciente. Elevando la vibración colectiva a través del conocimiento ancestral y moderno.
                    </p>
                    <div className="flex gap-4">
                        {[
                            { Icon: Instagram, link: settings.redes?.instagram },
                            { Icon: Facebook, link: settings.redes?.facebook },
                            { Icon: Twitter, link: settings.redes?.twitter },
                            { Icon: Youtube, link: settings.redes?.youtube }
                        ].map(({ Icon, link }, i) => (
                            <a
                                key={i}
                                href={link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links Column */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-100 mb-8">Explorar</h3>
                    <ul className="space-y-4">
                        {['Inicio', 'Todos los Cursos', 'Sobre Nosotros'].map((link, i) => (
                            <li key={i}>
                                <Link to={link === 'Inicio' ? '/' : link === 'Todos los Cursos' ? '/cursos' : '#'} className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Column */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-100 mb-8">Contacto</h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4 text-sm font-bold text-slate-500">
                            <MapPin size={20} className="text-primary flex-shrink-0" />
                            <span>{settings.contacto?.direccion || 'Argentina'} <br /> <span className="text-[10px] uppercase font-black opacity-50">Sede Central</span></span>
                        </li>
                        <li className="flex gap-4 text-sm font-bold text-slate-500">
                            <Mail size={20} className="text-primary flex-shrink-0" />
                            <span>{settings.contacto?.email}</span>
                        </li>
                        <li className="flex gap-4 text-sm font-bold text-slate-500">
                            <Phone size={20} className="text-primary flex-shrink-0" />
                            <span>{settings.contacto?.telefono}</span>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Column */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-100 mb-8">Vibraciones</h3>
                    <p className="text-sm text-slate-500 font-bold mb-6 italic leading-relaxed">
                        Recibe guías de meditación y ofertas exclusivas cada semana.
                    </p>
                    <form className="relative group">
                        <input
                            type="email"
                            placeholder="Tu portal de email..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:outline-none focus:border-primary transition-all text-slate-100 placeholder:text-slate-600"
                        />
                        <button className="absolute right-2 top-2 bottom-2 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                            <Send size={16} />
                        </button>
                    </form>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    © {new Date().getFullYear()} Aura Healing. <span className="text-primary/50 mx-2">●</span> Sin límites, solo expansión.
                </p>
                <div className="flex gap-8">
                    <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400">Privacidad</Link>
                    <Link to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400">Términos</Link>
                </div>
            </div>
        </footer>
    );
}
