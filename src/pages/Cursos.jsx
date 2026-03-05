import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import CourseCard from '../components/courses/CourseCard';
import { motion } from 'framer-motion';

export default function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const { data, error } = await supabase
                    .from('cursos')
                    .select('*')
                    .eq('activo', true);
                if (error) throw error;
                setCursos(data || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCursos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Grain/Shadow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-slate-100 mb-6 tracking-tighter"
                    >
                        Explora el <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Catálogo</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400 font-medium"
                    >
                        Encuentra el camino perfecto para tu desarrollo personal, mental y espiritual.
                    </motion.p>
                </div>

                {cursos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cursos.map((curso) => (
                            <CourseCard key={curso.id} course={curso} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <p className="text-slate-400 font-bold text-lg mb-4">Aún no hay cursos disponibles.</p>
                        <p className="text-slate-500 text-sm">Estamos preparando el contenido para tu evolución.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
