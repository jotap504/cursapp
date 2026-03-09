import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useSettings } from '../../hooks/useSettings';
import { supabase } from '../../supabase/client';

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export default function ChatbotWidget() {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! 🙌 Bienvenido a ' + (settings.nombre_pagina || 'nuestra plataforma') + '. Soy Lucía, parte del equipo. ¿En qué te puedo dar una mano hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

    useEffect(() => {
        const fetchFaqs = async () => {
            const { data } = await supabase.from('faqs').select('pregunta, respuesta');
            if (data) setFaqs(data);
        };
        fetchFaqs();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const getSystemPrompt = () => {
        const faqContext = faqs.map(f => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n');
        return `
Eres Lucía, una asistente real del equipo de "${settings.nombre_pagina}". 
Tu objetivo es ayudar a los alumnos y personas interesadas de forma humana, empática y resolutiva. 

REGLAS DE ORO (ESTILO WHATSAPP):
1. NO digas que eres una IA. Si te preguntan, di que eres parte del equipo de soporte.
2. Usa un tono informal y cercano (Español de Argentina/Latino, usa "voseo" si es natural).
3. Usa emojis de forma moderada pero natural (🙌, ✨, 😊, 👍).
4. Escribe mensajes cortos. Evita bloques de texto gigantes.
5. Si no sabes algo, di que vas a consultar con el equipo técnico y que te dejen su mail.

CONTEXTO DE LA WEB:
- Nombre: ${settings.nombre_pagina}
- Email de contacto: ${settings.contacto?.email}
- Teléfono: ${settings.contacto?.telefono}
- Misión: ${settings.hero_titulo}

CONOCIMIENTO ESPECÍFICO (FAQs):
${faqContext}

IMPORTANTE: 
- Solo responde sobre temas de la plataforma y bienestar.
- No des diagnósticos médicos, somos una plataforma de cursos.
`;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        if (!API_KEY || API_KEY === 'your_api_key_here') {
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Por favor, configura tu API KEY de DeepSeek para que pueda responderte.' }]);
            return;
        }

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                DEEPSEEK_API_URL,
                {
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: getSystemPrompt() },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: "user", content: input }
                    ],
                    temperature: 0.7
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const botMessage = response.data.choices[0].message;
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Uy, se me cortó la conexión. ¿Me repetís lo último o intentamos en un ratito? ✨' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
            {/* WhatsApp Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-[#e5ddd5] w-[350px] md:w-[380px] h-[550px] rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 border border-black/10"
                    >
                        {/* WhatsApp Header */}
                        <div className="bg-[#075e54] p-4 text-white flex items-center gap-3 shadow-md">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white/20">
                                <img
                                    src={settings.logo_url || "https://ui-avatars.com/api/?name=Lucia+Support&background=128C7E&color=fff"}
                                    alt="bot"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm leading-tight">Lucía ✨</h4>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <p className="text-[10px] text-white/80 font-medium">en línea</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-black/10 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* WhatsApp Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-4 flex flex-col gap-2 relative scroll-smooth"
                            style={{
                                backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                                backgroundSize: '400px',
                                backgroundRepeat: 'repeat'
                            }}
                        >
                            <div className="mx-auto bg-[#c6e9ff] text-[#075e54] text-[10px] font-bold px-3 py-1 rounded-md shadow-sm mb-4 uppercase tracking-wider">
                                Hoy
                            </div>

                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`max-w-[85%] p-2.5 rounded-lg text-sm shadow-sm relative ${m.role === 'user'
                                        ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                                        : 'bg-white text-slate-800 rounded-tl-none'
                                        }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className="text-[9px] text-slate-400 font-medium">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {m.role === 'user' && <span className="text-blue-400 text-[10px]">✓✓</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp Input Area */}
                        <div className="p-2.5 bg-[#f0f0f0] flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribe un mensaje"
                                    className="w-full bg-white border-none rounded-full py-2.5 px-5 focus:outline-none text-slate-800 text-sm shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="bg-[#128c7e] text-white p-3 rounded-full hover:bg-[#075e54] transition-all disabled:opacity-50 shadow-md flex items-center justify-center shrink-0"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating WhatsApp Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128c7e] transition-all border-4 border-white group relative"
            >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
                <MessageCircle size={32} fill="currentColor" />
            </motion.button>
        </div>
    );
}
