import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function Hero() {
    const { settings } = useSettings();

    return (
        <section className="relative px-4 pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            {/* Dynamic Background Elements */}
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--color-primary),0.15)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
                {/* Pulsing Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Nueva Era de Sanación</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter text-slate-100 whitespace-pre-line"
                >
                    {settings.hero_titulo}
                </motion.h2>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium"
                >
                    {settings.hero_subtitulo}
                </motion.p>


            </div>
        </section>
    );
}
