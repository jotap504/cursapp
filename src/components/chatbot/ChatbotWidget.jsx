import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `
Eres un asistente experto en medicina holística, bienestar integral y salud alternativa para la plataforma "HolísticaApp".
Tu tono es amigable, profesional, empático y cercano.

Identidad de marca: HolísticaApp es un espacio de transformación personal a través de cursos online.
Tu misión:
1. Responder preguntas sobre nuestros cursos (Herbolaria, Meditación, Nutrición Holística).
2. Explicar los beneficios de la medicina holística.
3. Informar sobre modalidades de pago (Mercado Pago), certificaciones y acceso a la plataforma.

RESTRICCIÓN CRÍTICA:
- NO des diagnósticos médicos ni prescripciones específicas.
- Si te preguntan por una enfermedad grave, sugiere siempre consultar con un profesional de la salud.
- Enfócate en la prevención, el equilibrio y el bienestar natural.
`;

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy tu guía holística. ¿En qué puedo ayudarte hoy en tu camino de bienestar?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

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
                        { role: "system", content: SYSTEM_PROMPT },
                        ...messages,
                        userMessage
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const botMessage = response.data.choices[0].message;
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, estoy teniendo problemas para conectar. ¿Podrías intentar de nuevo más tarde?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">

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
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="bot" className="w-full h-full object-cover" onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=Guia+Holistica&background=128C7E&color=fff"} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm leading-tight">Guía Holística</h4>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <p className="text-[10px] text-white/80 font-medium">En línea</p>
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
                            className="flex-grow overflow-y-auto p-4 flex flex-col gap-2 relative"
                            style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: 'contain' }}
                        >
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-2 rounded-lg text-sm shadow-sm relative ${m.role === 'user'
                                        ? 'bg-[#dcf8c6] text-slate-800'
                                        : 'bg-white text-slate-800'
                                        }`}>
                                        <p className="leading-relaxed">{m.content}</p>
                                        <span className="text-[9px] text-slate-400 float-right mt-1 ml-2 font-medium">
                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
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
                        <div className="p-2 bg-[#f0f0f0] flex items-center gap-2">
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
