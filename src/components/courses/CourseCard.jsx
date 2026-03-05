import { motion } from 'framer-motion';
import { Star, Clock, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
    if (!course) return null;
    const rating = course.puntuacion || course.rating || 4.8;
    const reviews = course.reviews || 120;

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
        >
            {/* Course Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={course.imagen || course.imagen_url || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800"}
                    alt={course.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                    {course.categoria || "Holístico"}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-slate-100 leading-tight group-hover:text-primary transition-colors">
                        {course.nombre}
                    </h3>
                    <div className="bg-primary/20 p-2 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2 font-medium">
                    {course.descripcion || course.descripcion_corta}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 py-2 border-y border-white/5">
                    <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-accent-orange fill-accent-orange" />
                        <span className="text-xs font-bold text-slate-200">{rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} />
                        <span className="text-xs font-bold">12h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Users size={14} />
                        <span className="text-xs font-bold">{reviews}</span>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inversión</span>
                        <span className="text-2xl font-black text-slate-100">${course.precio}</span>
                    </div>
                    <Link
                        to={`/curso/${course.id}`}
                        className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-primary hover:text-white"
                    >
                        Detalles
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
