import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, LogOut, HelpCircle } from 'lucide-react';
import CourseManagement from '../components/admin/CourseManagement';
import SiteSettings from '../components/admin/SiteSettings';
import FAQManagement from '../components/admin/FAQManagement';

export default function AdminDashboard() {
    const location = useLocation();

    const menuItems = [
        { name: 'Panel Principal', path: '/admin', icon: LayoutDashboard },
        { name: 'Gestión de Cursos', path: '/admin/courses', icon: BookOpen },
        { name: 'Gestión de FAQs', path: '/admin/faqs', icon: HelpCircle },
        { name: 'Configuración Web', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background-dark pt-24 pb-12 px-6 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-8 hidden md:flex">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest leading-none">Admin</h2>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Gestión</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${location.pathname === item.path
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/5 pt-6">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-400 transition-colors font-bold">
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-10">
                <Routes>
                    <Route path="/" element={<AdminHome />} />
                    <Route path="/courses" element={<CourseManagement />} />
                    <Route path="/faqs" element={<FAQManagement />} />
                    <Route path="/settings" element={<SiteSettings />} />
                </Routes>
            </main>
        </div>
    );
}

function AdminHome() {
    const categories = [
        { name: 'Cursos', path: '/admin/courses', icon: BookOpen, desc: 'Gestiona tu catálogo de cursos y contenidos.' },
        { name: 'Soporte (FAQs)', path: '/admin/faqs', icon: HelpCircle, desc: 'Administra las preguntas frecuentes y soporte.' },
        { name: 'Configuración', path: '/admin/settings', icon: Settings, desc: 'Cambia el logo, colores y textos de la web.' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-4xl font-black text-slate-100 mb-2 tracking-tighter">Bienvenido, Admin</h1>
                <p className="text-slate-400 font-medium italic">Selecciona una sección para comenzar la gestión de tu plataforma.</p>
            </header>

            {/* Quick Actions / Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat, i) => (
                    <Link
                        key={i}
                        to={cat.path}
                        className="group bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col gap-4"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <cat.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-100 mb-1">{cat.name}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{cat.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Cursos Activos', value: '5', color: 'from-blue-500/20 to-blue-500/5' },
                    { label: 'Ventas del Mes', value: '$0', color: 'from-green-500/20 to-green-500/5' },
                    { label: 'Nuevos Alumnos', value: '12', color: 'from-primary/20 to-primary/5' },
                ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br ${stat.color} flex flex-col gap-2`}>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                        <span className="text-4xl font-black text-slate-100 italic">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
