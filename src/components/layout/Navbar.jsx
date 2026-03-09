import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Menu, X, ShieldCheck, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

function cn(...inputs) { return twMerge(clsx(inputs)); }

const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Cursos', path: '/cursos' },
    { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
    { name: 'Contacto', path: '/contacto' },
];

// ── Login / Register Modal ──────────────────────────────────────────
function AuthModal({ onClose }) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ nombre: '', email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login({ email: form.email, password: form.password });
                onClose();
            } else {
                await register({ email: form.email, password: form.password, nombre: form.nombre });
                setSuccess('¡Cuenta creada! Revisá tu email para confirmar tu cuenta, luego iniciá sesión.');
            }
        } catch (err) {
            setError(err.message || 'Ocurrió un error. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[80] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-100 tracking-tighter">
                            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            {mode === 'login' ? 'Bienvenido de vuelta' : 'Unite a nuestra comunidad'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-100 transition-colors mt-1">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nombre — solo en registro */}
                    {mode === 'register' && (
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                required
                                type="text"
                                placeholder="Tu nombre"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary font-bold text-sm"
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            required
                            type="email"
                            placeholder="tu@email.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary font-bold text-sm"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            required
                            type={showPass ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            minLength={6}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary font-bold text-sm"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Error / Success */}
                    {error && <p className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">{error}</p>}
                    {success && <p className="text-green-400 text-xs font-bold bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-2.5">{success}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
                    </button>
                </form>

                {/* Toggle mode */}
                <p className="text-center text-slate-600 text-xs font-bold mt-6">
                    {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                        className="text-primary hover:text-secondary transition-colors font-black"
                    >
                        {mode === 'login' ? 'Registrate' : 'Iniciá sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
}

// ── Navbar ──────────────────────────────────────────────────────────
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { settings } = useSettings();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20 px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt="logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-white text-xl fill-1">auto_awesome</span>
                        )}
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-100 italic">{settings.nombre_pagina}</h1>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path}
                            className={({ isActive }) => cn("text-sm font-bold tracking-wide transition-colors uppercase",
                                isActive ? "text-primary" : "text-slate-400 hover:text-slate-100")}>
                            {link.name}
                        </NavLink>
                    ))}
                    {isAdmin && (
                        <NavLink to="/admin"
                            className={({ isActive }) => cn("flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-primary/30 transition-all",
                                isActive ? "bg-primary text-white" : "text-primary hover:bg-primary/10")}>
                            <ShieldCheck size={14} /> Admin
                        </NavLink>
                    )}
                </div>

                {/* Auth / Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/mi-cuenta" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                {user.foto ? (
                                    <img src={user.foto} alt={user.nombre} className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary/20" />
                                ) : (
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 ring-2 ring-primary/20 flex items-center justify-center text-primary font-black text-sm">
                                        {(user.nombre || user.email || '?')[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-xs font-bold text-slate-100 hidden lg:inline">
                                    {(user.nombre || user.email)?.split(' ')[0]}
                                </span>
                            </Link>
                            <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuth(true)}
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            <Mail size={14} /> Ingresar
                        </button>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-100 focus:outline-none">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={cn("fixed inset-0 bg-background-dark/95 backdrop-blur-xl z-40 md:hidden transition-all duration-300 flex flex-col justify-center items-center gap-8",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none")}>
                {navLinks.map((link) => (
                    <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                        className={({ isActive }) => cn("text-3xl font-black tracking-tighter transition-colors uppercase",
                            isActive ? "text-primary" : "text-slate-500")}>
                        {link.name}
                    </NavLink>
                ))}
                {isAdmin && (
                    <NavLink to="/admin" onClick={() => setIsOpen(false)}
                        className={({ isActive }) => cn("flex items-center gap-3 text-3xl font-black tracking-tighter transition-colors uppercase",
                            isActive ? "text-primary" : "text-slate-500")}>
                        <ShieldCheck size={32} /> Admin
                    </NavLink>
                )}
                {!user && (
                    <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
                        className="mt-4 bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-transform flex items-center gap-2">
                        <Mail size={20} /> Ingresar
                    </button>
                )}
            </div>

            {/* Bottom Nav Mobile */}
            <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-primary/20 px-6 py-3 flex items-center justify-between z-50 md:hidden pb-safe">
                <NavLink to="/" className={({ isActive }) => cn("flex flex-col items-center gap-1", isActive ? "text-primary" : "text-slate-400")}>
                    <span className="material-symbols-outlined fill-1">home</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
                </NavLink>
                <NavLink to="/cursos" className={({ isActive }) => cn("flex flex-col items-center gap-1", isActive ? "text-primary" : "text-slate-400")}>
                    <span className="material-symbols-outlined">menu_book</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cursos</span>
                </NavLink>
                <Link to="/carrito" className="flex flex-col items-center gap-1 text-slate-400 relative">
                    <span className="material-symbols-outlined">shopping_bag</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Carrito</span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Link>
                <NavLink to="/mi-cuenta" className={({ isActive }) => cn("flex flex-col items-center gap-1", isActive ? "text-primary" : "text-slate-400")}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
                </NavLink>
                {isAdmin && (
                    <NavLink to="/admin" className={({ isActive }) => cn("flex flex-col items-center gap-1", isActive ? "text-primary" : "text-slate-400")}>
                        <span className="material-symbols-outlined">shield_person</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
                    </NavLink>
                )}
            </nav>

            {/* Auth Modal */}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </>
    );
}
