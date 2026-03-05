import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
    {
        q: "¿Cómo accedo a los cursos una vez comprados?",
        a: "Una vez confirmado el pago, recibirás un correo automático con tus accesos. También podrás verlos inmediatamente en la sección 'Mi Cuenta' de la plataforma."
    },
    {
        q: "¿Los cursos tienen certificación?",
        a: "Sí, todos nuestros cursos incluyen un certificado digital de finalización avalado por HolísticaApp y nuestros instructores certificados."
    },
    {
        q: "¿Necesito conocimientos previos?",
        a: "La mayoría de nuestros cursos introductorios están diseñados para principiantes. En la descripción de cada curso detallamos si se requiere alguna base previa."
    },
    {
        q: "¿Qué medios de pago aceptan?",
        a: "Aceptamos todas las tarjetas de crédito y débito a través de Mercado Pago, así como efectivo en puntos de pago (Rapipago, Pago Fácil) y transferencias."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

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
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`border rounded-[2rem] transition-all duration-300 ${openIndex === idx ? "border-earth-300 bg-sand-50 shadow-lg" : "border-sand-200 bg-white hover:border-earth-200"
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center p-8 text-left focus:outline-none"
                            >
                                <span className="font-serif text-xl font-bold text-sage-950">{faq.q}</span>
                                <div className={`p-2 rounded-full transition-colors ${openIndex === idx ? "bg-earth-500 text-white" : "bg-sand-100 text-sage-500"}`}>
                                    {openIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-96 pb-8 px-8" : "max-h-0"}`}>
                                <p className="text-sage-700 leading-relaxed font-medium border-t border-sand-200 pt-6">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
