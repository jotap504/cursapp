import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../hooks/useAuth';
import { Star, Clock, Users, Play, Shield, Globe, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { createPreference } from '../services/mercadoPago';
import CourseReviews from '../components/courses/CourseReviews';

export default function CourseDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [curso, setCurso] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = curso ? getYoutubeId(curso.video_url) : null;

    useEffect(() => {
        const checkEnrollment = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('inscripciones')
                .select('id')
                .eq('usuario_id', user.id)
                .eq('curso_id', id)
                .single();
            if (!error && data) setEnrolled(true);
        };

        const fetchCurso = async () => {
            try {
                const { data, error } = await supabase
                    .from('cursos')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                setCurso(data);
                if (user) checkEnrollment();
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurso();
    }, [id, user]);

    const handleBuy = async () => {
        if (!user) {
            alert('Debés iniciar sesión para inscribirte a un curso.');
            return;
        }
        try {
            const preferenceId = await createPreference(curso, user);
            if (preferenceId) {
                window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
            }
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!curso) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Curso no encontrado</div>;

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 pb-20">
            {/* Video Hero Section */}
            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden group">
                <img
                    src={curso.imagen_url || curso.imagen || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200"}
                    alt={curso.nombre}
                    className="w-full h-full object-cover brightness-50 transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {enrolled && playing && youtubeId ? (
                        <div className="absolute inset-0 bg-black z-10 animate-in fade-in duration-500">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : enrolled ? (
                        <button
                            onClick={() => youtubeId ? setPlaying(true) : window.open(curso.video_url, '_blank')}
                            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/40 active:scale-95 transition-all group/play z-20"
                        >
                            <Play fill="white" size={32} className="ml-1 transition-transform group-hover/play:scale-110" />
                        </button>
                    ) : (
                        <button
                            onClick={handleBuy}
                            className="w-20 h-20 bg-slate-500/50 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-2xl active:scale-95 transition-all group/play"
                        >
                            <Play fill="white" size={32} className="ml-1 opacity-50" />
                        </button>
                    )}
                </div>

                {/* Course Info Brief */}
                <div className="absolute bottom-8 left-0 right-0 px-4 md:px-12 pointer-events-none">
                    <div className="max-w-7xl mx-auto flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-[0.2em]">En línea</span>
                            <div className="flex items-center gap-1.5 text-accent-orange">
                                <Star size={14} fill="currentColor" />
                                <span className="text-xs font-black">4.9 (2k Reseñas)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tightest leading-none drop-shadow-2xl">
                            {curso.nombre}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-primary">Descripción</h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
                            "{curso.descripcion}"
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duración</span>
                                <span className="font-bold text-slate-200">{curso.duracion || '—'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nivel</span>
                                <span className="font-bold text-slate-200">{curso.nivel || '—'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Acceso</span>
                                <span className="font-bold text-slate-200">{curso.acceso || 'De por vida'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Certificado</span>
                                <span className="font-bold text-slate-200">{curso.certificado || 'SI'}</span>
                            </div>
                        </div>
                    </section>

                    {curso.temario?.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-accent-teal">Lo que aprenderás</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {curso.temario.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/10">
                                        <CheckCircle size={20} className="text-accent-teal flex-shrink-0 mt-1" />
                                        <p className="font-bold text-slate-300">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {enrolled && Array.isArray(curso.archivos) && curso.archivos.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-primary">Material Adjunto</h2>
                            <div className="space-y-4">
                                {curso.archivos.map((file, i) => (
                                    <a
                                        key={i}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-200">{file.nombre || 'Archivo adjunto'}</h4>
                                                <span className="text-[10px] font-black uppercase text-slate-500">Documento PDF / Recurso</span>
                                            </div>
                                        </div>
                                        <ExternalLink size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Course Reviews Section */}
                    <div className="pt-12 border-t border-white/5">
                        <CourseReviews cursoId={id} user={user} />
                    </div>
                </div>

                {/* Right Sidebar - Purchase Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 p-8 rounded-[2.5rem] bg-white text-slate-900 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Precio Especial</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">${curso.precio}</span>
                                <span className="text-lg text-slate-400 line-through font-bold">${(curso.precio * 1.5).toFixed(0)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {enrolled ? (
                                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-center space-y-2">
                                    <CheckCircle size={32} className="mx-auto" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Ya estás inscrito</h4>
                                    <p className="text-[10px] font-bold opacity-70">Disfruta de todo el material exclusivo de este curso.</p>
                                </div>
                            ) : (
                                <button
                                    onClick={handleBuy}
                                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/40"
                                >
                                    Inscribirme Ahora
                                </button>
                            )}
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Shield size={12} />
                                Garantía de 7 días
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-slate-100">
                            <h3 className="text-xs font-black uppercase tracking-widest">Este curso incluye:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-bold opacity-70">
                                    <Play size={16} /> Contenido en Video HD
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold opacity-70">
                                    <Award size={16} /> Certificado de finalización
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold opacity-70">
                                    <Globe size={16} /> Comunidad exclusiva de alumnos
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
