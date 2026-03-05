import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { Plus, Trash2, Save, MoveUp, MoveDown, HelpCircle } from 'lucide-react';

export default function FAQManagement() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newItem, setNewItem] = useState({ pregunta: '', respuesta: '' });

    const fetchFaqs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('orden', { ascending: true });
        if (!error) setFaqs(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        const nextOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.orden)) + 1 : 1;
        const { error } = await supabase
            .from('faqs')
            .insert([{ ...newItem, orden: nextOrder }]);

        if (!error) {
            setNewItem({ pregunta: '', respuesta: '' });
            fetchFaqs();
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (!error) fetchFaqs();
    };

    const handleMove = async (index, direction) => {
        const newFaqs = [...faqs];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newFaqs.length) return;

        // Swap order values
        const current = newFaqs[index];
        const next = newFaqs[targetIndex];

        const tempOrder = current.orden;
        current.orden = next.orden;
        next.orden = tempOrder;

        setSaving(true);
        const { error } = await supabase.from('faqs').upsert([
            { id: current.id, orden: current.orden },
            { id: next.id, orden: next.orden }
        ]);

        if (!error) fetchFaqs();
        setSaving(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-100 flex items-center gap-3">
                        <HelpCircle className="text-primary" /> Gestión de FAQs
                    </h2>
                    <p className="text-slate-400 font-medium">Administra las preguntas frecuentes que ven tus alumnos.</p>
                </div>
            </header>

            {/* Form to add new FAQ */}
            <form onSubmit={handleAdd} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Pregunta</label>
                        <input
                            type="text"
                            required
                            value={newItem.pregunta}
                            onChange={e => setNewItem({ ...newItem, pregunta: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-100 font-bold focus:outline-none focus:border-primary transition-colors"
                            placeholder="¿Cómo...?"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Respuesta</label>
                        <input
                            type="text"
                            required
                            value={newItem.respuesta}
                            onChange={e => setNewItem({ ...newItem, respuesta: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-100 font-bold focus:outline-none focus:border-primary transition-colors"
                            placeholder="La respuesta es..."
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white font-black px-8 py-4 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                >
                    <Plus size={16} /> {saving ? 'Guardando...' : 'Agregar Pregunta'}
                </button>
            </form>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-12 text-center text-slate-500 italic">Cargando FAQs...</div>
                ) : faqs.length > 0 ? (
                    faqs.map((faq, idx) => (
                        <div key={faq.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                            <div className="flex-1">
                                <h4 className="font-black text-slate-100 mb-2">{faq.pregunta}</h4>
                                <p className="text-sm text-slate-400 font-medium italic">"{faq.respuesta}"</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleMove(idx, -1)}
                                    disabled={idx === 0 || saving}
                                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-primary disabled:opacity-0 transition-all"
                                >
                                    <MoveUp size={18} />
                                </button>
                                <button
                                    onClick={() => handleMove(idx, 1)}
                                    disabled={idx === faqs.length - 1 || saving}
                                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-primary disabled:opacity-0 transition-all"
                                >
                                    <MoveDown size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(faq.id)}
                                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center text-slate-600 font-medium uppercase tracking-widest text-xs border-2 border-dashed border-white/5 rounded-[2rem]">
                        No hay preguntas frecuentes registradas.
                    </div>
                )}
            </div>
        </div>
    );
}
