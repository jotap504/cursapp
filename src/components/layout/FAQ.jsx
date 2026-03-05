import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { supabase } from '../../supabase/client';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('orden', { ascending: true });

            if (!error) setFaqs(data || []);
            setLoading(false);
        };
        fetchFaqs();
    }, []);

    if (loading || faqs.length === 0) return null;

    return (
        <section className="py-24 bg-white px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-earth-100 text-earth-800 px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest leading-none">
                        <HelpCircle size={16} />
                        <span>Tus dudas resueltas</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-sage-950 mb-6 tracking-tight">Preguntas Frecuentes</h2>
                    <p className="text-sage-700 font-medium">Todo lo que necesitas saber sobre nuestra metodología y plataforma.</p>
                </div>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={faq.id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`border rounded-[2rem] transition-all duration-300 ${openIndex === idx ? "border-earth-300 bg-sand-50 shadow-lg" : "border-sand-200 bg-white hover:border-earth-200"
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center p-8 text-left focus:outline-none"
                            >
                                <span className="font-serif text-xl font-bold text-sage-950">{faq.pregunta}</span>
                                <div className={`p-2 rounded-full transition-colors ${openIndex === idx ? "bg-earth-500 text-white" : "bg-sand-100 text-sage-500"}`}>
                                    {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-96 pb-8 px-8" : "max-h-0"}`}>
                                <p className="text-sage-700 leading-relaxed font-medium border-t border-sand-200 pt-6">
                                    {faq.respuesta}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
