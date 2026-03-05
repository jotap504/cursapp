import { Mail, Phone, Instagram, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
    return (
        <section className="py-24 bg-sand-50 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="flex flex-col gap-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif text-sage-950 mb-6 tracking-tight">Hablemos de tu <span className="text-earth-500 italic">evolución</span></h2>
                        <p className="text-lg text-sage-700 leading-relaxed font-medium">¿Tienes dudas sobre algún curso o modalidad? Nuestro equipo está listo para asesorarte en tu camino hacia el bienestar integral.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-sand-200 text-earth-500">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-1">Escríbenos</p>
                                <p className="text-xl font-serif font-bold text-sage-950">info@holistica-app.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-sand-200 text-earth-500">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-1">WhatsApp</p>
                                <p className="text-xl font-serif font-bold text-sage-950">+54 9 11 1234 5678</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-sand-200">
                        <p className="text-sm font-bold text-sage-500 uppercase tracking-widest mb-6">Síguenos en Redes</p>
                        <div className="flex gap-4">
                            <a href="#" className="p-4 bg-white rounded-2xl border border-sand-200 text-sage-800 hover:bg-earth-500 hover:text-white transition-all shadow-sm">
                                <Instagram size={24} />
                            </a>
                            <a href="#" className="p-4 bg-white rounded-2xl border border-sand-200 text-sage-800 hover:bg-earth-500 hover:text-white transition-all shadow-sm">
                                <Phone size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-sand-200">
                    <form className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-sage-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="bg-sand-50 border border-sand-200 rounded-2xl p-4 focus:outline-none focus:border-earth-300 transition-colors text-sage-900 font-medium"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-sage-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="bg-sand-50 border border-sand-200 rounded-2xl p-4 focus:outline-none focus:border-earth-300 transition-colors text-sage-900 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-sage-500 uppercase tracking-widest ml-1">Mensaje</label>
                            <textarea
                                rows="4"
                                placeholder="¿En qué podemos ayudarte?"
                                className="bg-sand-50 border border-sand-200 rounded-2xl p-4 focus:outline-none focus:border-earth-300 transition-colors text-sage-900 font-medium resize-none"
                            ></textarea>
                        </div>

                        <button className="bg-sage-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-sage-700 transition-all shadow-lg hover:shadow-xl mt-4">
                            <Send size={20} />
                            <span>Enviar Mensaje</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
