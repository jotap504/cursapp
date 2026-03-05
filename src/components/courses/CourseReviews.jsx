import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseReviews({ cursoId, user }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myReview, setMyReview] = useState({ rating: 5, comentario: '' });
    const [hasEnrolled, setHasEnrolled] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('resenas')
                .select('*, perfiles:usuario_id(nombre, foto)')
                .eq('curso_id', cursoId)
                .order('created_at', { ascending: false });

            if (!error) {
                setReviews(data || []);
                if (user) {
                    const reviewed = data.find(r => r.usuario_id === user.id);
                    if (reviewed) setHasReviewed(true);
                }
            } else {
                console.warn('Reviews table not found or restricted:', error.message);
            }
        } catch (err) {
            console.error('Fetch reviews error:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollment = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('inscripciones')
                .select('id')
                .eq('usuario_id', user.id)
                .eq('curso_id', cursoId)
                .single();
            if (!error && data) setHasEnrolled(true);
        } catch (err) {
            console.error('Check enrollment error:', err);
        }
    };

    useEffect(() => {
        fetchReviews();
        checkEnrollment();
    }, [cursoId, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const { error } = await supabase
            .from('resenas')
            .insert([{
                curso_id: cursoId,
                usuario_id: user.id,
                rating: myReview.rating,
                comentario: myReview.comentario
            }]);

        if (!error) {
            setHasReviewed(true);
            fetchReviews();
        } else {
            alert('Error al enviar reseña: ' + error.message);
        }
        setSubmitting(false);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <section className="space-y-12">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-baseline gap-4"
            >
                <h2 className="text-2xl font-black uppercase tracking-widest text-accent-orange">Reseñas de Alumnos</h2>
                {reviews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-accent-orange bg-accent-orange/10 px-4 py-1 rounded-full border border-accent-orange/20"
                    >
                        <Star size={16} fill="currentColor" />
                        <span className="font-black text-sm">{averageRating} calificación promedio</span>
                        <span className="text-[10px] font-bold opacity-60">({reviews.length} opiniones)</span>
                    </motion.div>
                )}
            </motion.div>

            {hasEnrolled && !hasReviewed && (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="p-8 rounded-[2.5rem] bg-white/5 border border-primary/20 space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                            <Star size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic">Tu opinión nos importa</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Comparte tu experiencia con otros alumnos</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setMyReview({ ...myReview, rating: star })}
                                    className={`p-2 transition-all ${myReview.rating >= star ? 'text-accent-orange scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                                >
                                    <Star fill={myReview.rating >= star ? "currentColor" : "none"} size={28} />
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tu Comentario</label>
                            <textarea
                                required
                                value={myReview.comentario}
                                onChange={e => setMyReview({ ...myReview, comentario: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-100 font-medium focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                                placeholder="¿Qué te pareció el curso? Cuéntanos los puntos clave..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-primary text-white font-black px-8 py-4 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                        >
                            <Send size={16} /> {submitting ? 'Enviando...' : 'Publicar Reseña'}
                        </button>
                    </div>
                </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-500 italic">Cargando reseñas...</div>
                ) : reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-slate-800">
                                        {review.perfiles?.foto ? (
                                            <img src={review.perfiles.foto} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-100">{review.perfiles?.nombre || 'Alumno'}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-accent-orange">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                                "{review.comentario}"
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="col-span-full py-12 text-center text-slate-600 font-medium uppercase tracking-widest text-xs border-2 border-dashed border-white/5 rounded-[2.5rem]"
                    >
                        Aún no hay reseñas para este curso. Sé el primero en opinar.
                    </motion.div>
                )}
            </div>
        </section>
    );
}
