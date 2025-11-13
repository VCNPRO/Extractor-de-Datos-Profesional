import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './Icons';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'laia';
    timestamp: Date;
}

interface ChatbotLaiaProps {
    isLightMode?: boolean;
}

// Base de conocimiento de Laia basada en las guías de usuario
const LAIA_KNOWLEDGE = {
    greetings: [
        "¡Hola! Soy Laia, tu asistente virtual de VerbaDoc Europa. ¿En qué puedo ayudarte hoy?",
        "¡Bienvenido/a! Soy Laia. Estoy aquí para ayudarte con VerbaDoc Europa. ¿Qué necesitas saber?",
    ],
    quickStart: "Para empezar rápido:\n1️⃣ Sube tu documento (PDF, JPG, PNG)\n2️⃣ Selecciona una plantilla del panel derecho\n3️⃣ Haz clic en 'Ejecutar Extracción'\n4️⃣ Exporta los resultados en Excel, CSV o JSON",
    templates: "Tenemos plantillas para varios departamentos:\n• General\n• Contabilidad (facturas, gastos)\n• Finanzas (informes)\n• Marketing (presupuestos)\n• Legal (contratos)\n• Recursos Humanos\n\nPuedes crear tus propias plantillas en 'Mis Modelos'.",
    createTemplate: "Para crear una plantilla:\n1. Ve al panel derecho\n2. Haz clic en 'Mis Modelos' para expandir\n3. Haz clic en 'Crear Nueva Plantilla'\n4. Dale un nombre descriptivo\n5. Escribe el prompt (qué extraer)\n6. Define los campos del esquema\n7. Guarda tu plantilla\n\n⚠️ Recuerda: no uses espacios ni tildes en nombres de campos.",
    models: "VerbaDoc Europa ofrece 3 modelos de IA:\n• **Genérico** 🇪🇺 - Económico, para documentos simples\n• **Recomendado** 🇪🇺 - Equilibrado, para la mayoría de casos\n• **Avanzado** 🇪🇺 - Potente, para documentos complejos\n\nTodos procesados 100% en Europa (Bélgica).",
    security: "VerbaDoc Europa garantiza:\n🇪🇺 Procesamiento 100% en Europa (Bélgica)\n🔒 Cumplimiento RGPD/GDPR\n🏢 Protección de datos empresariales\n🔐 Cifrado TLS 1.3\n📜 Certificaciones: ISO 27001, ISO 27018, SOC 2\n\nTus documentos NO se almacenan en nuestros servidores.",
    fieldTypes: "Tipos de campos disponibles:\n• STRING - Texto (nombre, dirección)\n• NUMBER - Números (precio, cantidad)\n• BOOLEAN - Sí/No (¿pagado?)\n• ARRAY_OF_STRINGS - Lista de textos\n• ARRAY_OF_OBJECTS - Lista de grupos\n• OBJECT - Grupo de campos",
    batch: "Para procesar muchos documentos:\n1. Sube todos los archivos similares\n2. Configura el esquema con el primero\n3. Haz clic en 'Procesar Todos'\n4. ¡Todos se procesarán automáticamente!",
    export: "Puedes exportar en 3 formatos:\n• **Excel** (.xlsx) - Recomendado para análisis\n• **CSV** - Para hojas de cálculo\n• **JSON** - Para sistemas e integraciones",
    tips: "💡 **Consejos útiles:**\n✅ Usa plantillas para ahorrar tiempo\n✅ Prueba con 1 documento antes de procesar 100\n✅ Modelo Recomendado para docs estándar\n✅ Guarda tus plantillas para reutilizar\n\n❌ **Evita:**\n❌ Mezclar tipos de documentos\n❌ Prompts vagos como 'dame todo'\n❌ Procesar sin probar primero",
    help: "Puedo ayudarte con:\n• Cómo empezar rápido\n• Crear plantillas personalizadas\n• Tipos de modelos de IA\n• Seguridad y cumplimiento RGPD\n• Tipos de campos\n• Procesamiento en lote\n• Exportar resultados\n• Consejos y mejores prácticas\n\n¿Sobre qué quieres saber más?",
};

const findBestResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Saludos
    if (msg.match(/hola|buenos|buenas|hey|hi/i)) {
        return LAIA_KNOWLEDGE.greetings[Math.floor(Math.random() * LAIA_KNOWLEDGE.greetings.length)];
    }

    // Inicio rápido
    if (msg.match(/empezar|comenzar|inicio|rápid|quick|start/i)) {
        return LAIA_KNOWLEDGE.quickStart;
    }

    // Plantillas
    if (msg.match(/plantilla|template|modelo/i) && msg.match(/crear|nueva|hacer|generar/i)) {
        return LAIA_KNOWLEDGE.createTemplate;
    }
    if (msg.match(/plantilla|template/i)) {
        return LAIA_KNOWLEDGE.templates;
    }

    // Modelos de IA
    if (msg.match(/modelo|ia|inteligencia|gemini|genérico|recomendado|avanzado/i)) {
        return LAIA_KNOWLEDGE.models;
    }

    // Seguridad
    if (msg.match(/seguridad|rgpd|gdpr|cumplimiento|legal|privacidad|europa|certificación/i)) {
        return LAIA_KNOWLEDGE.security;
    }

    // Tipos de campos
    if (msg.match(/campo|tipo|string|number|boolean|array|object/i)) {
        return LAIA_KNOWLEDGE.fieldTypes;
    }

    // Lote/Batch
    if (msg.match(/lote|batch|múltiple|muchos|varios documentos/i)) {
        return LAIA_KNOWLEDGE.batch;
    }

    // Exportar
    if (msg.match(/exportar|descargar|guardar|excel|csv|json/i)) {
        return LAIA_KNOWLEDGE.export;
    }

    // Consejos
    if (msg.match(/consejo|tip|mejor|práctica|recomendación/i)) {
        return LAIA_KNOWLEDGE.tips;
    }

    // Ayuda general
    if (msg.match(/ayuda|help|qué puedes|qué sabes/i)) {
        return LAIA_KNOWLEDGE.help;
    }

    // Respuesta por defecto
    return "Interesante pregunta. Puedo ayudarte con:\n• Inicio rápido\n• Crear plantillas\n• Modelos de IA\n• Seguridad RGPD\n• Procesamiento en lote\n• Exportar resultados\n\n¿Sobre qué quieres saber más específicamente?";
};

export const ChatbotLaia: React.FC<ChatbotLaiaProps> = ({ isLightMode = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy Laia, tu asistente de VerbaDoc Europa 🇪🇺\n\n¿En qué puedo ayudarte hoy?',
            sender: 'laia',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Agregar mensaje del usuario
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simular respuesta de Laia con delay
        setTimeout(() => {
            const response = findBestResponse(inputValue);
            const laiaMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'laia',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, laiaMessage]);
            setIsTyping(false);
        }, 800);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const bgColor = isLightMode ? '#ffffff' : '#1e293b';
    const textColor = isLightMode ? '#1f2937' : '#f1f5f9';
    const accentColor = isLightMode ? '#2563eb' : '#06b6d4';
    const bubbleUserBg = isLightMode ? '#2563eb' : '#0891b2';
    const bubbleLaiaBg = isLightMode ? '#f0f9ff' : '#0f172a';
    const borderColor = isLightMode ? '#d1d5db' : '#475569';

    return (
        <>
            {/* Botón flotante */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110"
                    style={{ backgroundColor: accentColor }}
                    title="Chat con Laia"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </button>
            )}

            {/* Ventana de chat */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col z-50 border-2"
                    style={{ backgroundColor: bgColor, borderColor }}
                >
                    {/* Header */}
                    <div
                        className="p-4 rounded-t-2xl flex items-center justify-between border-b-2"
                        style={{ backgroundColor: accentColor, borderColor }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-lg" style={{ color: accentColor }}>
                                L
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Laia</h3>
                                <p className="text-xs text-white/80">Asistente Virtual</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                            <XIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        message.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                                    }`}
                                    style={{
                                        backgroundColor: message.sender === 'user' ? bubbleUserBg : bubbleLaiaBg,
                                        color: message.sender === 'user' ? '#ffffff' : textColor,
                                        border: message.sender === 'laia' ? `1px solid ${borderColor}` : 'none'
                                    }}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div
                                    className="rounded-2xl rounded-bl-none px-4 py-3 border"
                                    style={{
                                        backgroundColor: bubbleLaiaBg,
                                        borderColor
                                    }}
                                >
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t-2" style={{ borderColor }}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu pregunta..."
                                className="flex-1 px-4 py-2 rounded-full border-2 focus:outline-none transition-colors"
                                style={{
                                    backgroundColor: isLightMode ? '#f9fafb' : '#0f172a',
                                    borderColor,
                                    color: textColor
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: accentColor }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs mt-2 text-center" style={{ color: isLightMode ? '#6b7280' : '#94a3b8' }}>
                            Laia está aquí para ayudarte 🇪🇺
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
