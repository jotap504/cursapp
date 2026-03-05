import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase/client';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, BookOpen, CreditCard, LogOut, ChevronRight, User, ExternalLink } from 'lucide-react';

export default function MyAccount() {
    const { user, logout, claimAdmin } = useAuth();
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInscripciones = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('inscripciones')
            .select('*, cursos(*)')
            .eq('usuario_id', user.id);

        if (!error) setInscripciones(data || []);
        setLoading(false);
    };

    useEffect(() => {
        const handleMPRedirect = async () => {
            const params = new URLSearchParams(window.location.search);
            const status = params.get('status');
            const cursoId = params.get('cursoId');
            const paymentId = params.get('payment_id');

            if (status === 'success' && cursoId && user) {
                // Registrar inscripción si no existe
                const { error } = await supabase
                    .from('inscripciones')
                    .insert([
                        {
                            usuario_id: user.id,
                            curso_id: cursoId,
                            payment_id: paymentId,
                            status: 'approved'
                        }
                    ]);

                if (!error || error.code === '23505') { // 23505 is unique violation
                    // Limpiar URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
            fetchInscripciones();
        };

        if (user) handleMPRedirect();
    }, [user]);

    if (!user) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl text-center max-w-sm w-full">
                <h2 className="text-2xl font-black text-slate-100 mb-4">Acceso Restringido</h2>
                <p className="text-slate-400 mb-8 font-medium italic">Debes iniciar sesión para ver tu perfil espiritual.</p>
                <button className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">
                    Volver al Inicio
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar Profile Card */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-primary/20 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[60px] group-hover:bg-primary/40 transition-colors"></div>

                        <div className="relative flex flex-col items-center text-center gap-6">
                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-primary/20 shadow-2xl">
                                <img src={user.foto || user.photoURL} alt={user.nombre} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black leading-tight">{user.nombre}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{user.email}</p>
                            </div>
                            <div className="w-full pt-6 border-t border-white/5 space-y-4">
                                {!user.rol || user.rol !== 'admin' ? (
                                    <button
                                        onClick={async () => {
                                            const success = await claimAdmin();
                                            if (success) {
                                                alert('¡Ahora eres administrador! Recarga la página.');
                                                window.location.reload();
                                            }
                                        }}
                                        className="w-full py-3 rounded-2xl bg-primary/10 border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        Reclamar Admin (Dev)
                                    </button>
                                ) : (
                                    <div className="w-full py-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center justify-center gap-2">
                                        Rol: Administrador
                                    </div>
                                )}
                                <button onClick={logout} className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                                    <LogOut size={14} /> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                        <ul className="space-y-2">
                            {[
                                { icon: <BookOpen size={18} />, label: 'Mis Cursos', active: true },
                                { icon: <CreditCard size={18} />, label: 'Pagos' },
                                { icon: <Settings size={18} />, label: 'Configuración' },
                            ].map((item, i) => (
                                <li key={i}>
                                    <button className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${item.active ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        {item.active && <ChevronRight size={14} />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-3 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tightest">Mi Espacio</h1>
                            <p className="text-slate-400 font-medium italic mt-2">Bienvenido de nuevo a tu camino de evolución.</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-accent-teal/10 border border-accent-teal/20 text-accent-teal font-black text-[10px] uppercase tracking-widest">
                            <User size={14} fill="currentColor" /> Alumno Premium
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            <div className="col-span-full py-12 text-center text-slate-500 font-medium italic">
                                Cargando tus cursos...
                            </div>
                        ) : inscripciones.length > 0 ? (
                            inscripciones.map((ins) => (
                                <Link key={ins.id} to={`/cursos/${ins.cursos.id}`} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 group hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border border-white/10">
                                            <img src={ins.cursos.imagen_url || ins.cursos.imagen} alt={ins.cursos.nombre} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <h4 className="text-lg font-black group-hover:text-primary transition-colors leading-tight">{ins.cursos.nombre}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest">Activo</div>
                                                <span className="text-[10px] font-bold text-slate-500">Comprado: {new Date(ins.fecha).toLocaleDateString()}</span>
                                            </div>
                                            <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-2 transition-all">
                                                Comenzar <ExternalLink size={10} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <Link to="/cursos" className="p-6 rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all cursor-pointer text-slate-500 hover:text-primary">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">Explorar nuevos caminos</span>
                            </Link>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
