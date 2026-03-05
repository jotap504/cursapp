import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import CourseCard from './CourseCard';

export default function FeaturedCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data, error } = await supabase
                    .from('cursos')
                    .select('*')
                    .eq('activo', true)
                    .limit(3);
                if (error) throw error;
                setCourses(data || []);
            } catch (error) {
                console.error('Error fetching featured courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <section className="py-24 bg-background-dark px-6 relative overflow-hidden">
            {/* Background Grain/Shadow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-100 mb-6 tracking-tighter"
                        >
                            Cursos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Destacados</span>
                        </motion.h2>
                        <p className="text-slate-400 leading-relaxed font-medium italic">
                            Nuestra selección de capacitaciones más valoradas por la comunidad. Comienza hoy tu camino hacia una vida más saludable y consciente.
                        </p>
                    </div>
                    <Link to="/cursos" className="group flex items-center gap-2 text-primary font-black hover:text-secondary transition-colors uppercase tracking-[0.2em] text-[10px]">
                        Ver Todos los Cursos
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                        <p className="text-slate-400">Próximamente más cursos destacados.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
