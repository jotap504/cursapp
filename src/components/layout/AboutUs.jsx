import { CheckCircle2, Award, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUs() {
    const values = [
        {
            icon: <Award className="text-accent-orange" />,
            title: "Excelencia Académica",
            description: "Contenidos curados por expertos con amplia trayectoria en medicina integral."
        },
        {
            icon: <Heart className="text-secondary" />,
            title: "Bienestar Holístico",
            description: "Abordamos la salud desde una perspectiva física, mental y espiritual."
        },
        {
            icon: <Shield className="text-primary" />,
            title: "Seguridad y Rigor",
            description: "Prácticas seguras y validadas por la experiencia clínica ancestral."
        }
    ];

    return (
        <section className="py-24 bg-background-dark px-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Image Side */}
                <div className="relative">
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                            alt="Sobre Nosotros"
                            className="w-full aspect-[4/5] object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                    </div>

                    {/* Experience Badge */}
                    <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 z-20 flex flex-col items-center">
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary leading-none mb-1">15+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Años de <br />Experiencia</p>
                    </div>
                </div>

                {/* Right: Content Side */}
                <div className="flex flex-col gap-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-100 mb-6 tracking-tighter">
                            Nuestro compromiso es con tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">bienestar integral.</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-medium mb-8">
                            En Aura creemos que la salud verdadera nace del equilibrio entre el cuerpo y el espíritu. Nuestra misión es democratizar el acceso al conocimiento de la medicina alternativa con rigor y calidez humana.
                        </p>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Expertos certificados a nivel mundial",
                                "Comunidad activa de alumnos",
                                "Contenido actualizado mensualmente",
                                "Soporte personalizado 24/7"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-200 font-bold text-sm">
                                    <CheckCircle2 size={18} className="text-secondary shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-6 pt-10 border-t border-white/10">
                        {values.map((v, idx) => (
                            <div key={idx} className="flex gap-4 group p-4 rounded-3xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
                                <div className="bg-white/5 p-4 rounded-2xl shadow-sm border border-white/10 shrink-0 flex items-center justify-center">
                                    {v.icon}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-100 mb-1 leading-tight group-hover:text-primary transition-colors">{v.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
