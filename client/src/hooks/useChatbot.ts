import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export function useChatbot() {
    const { language, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Al iniciar, cargar mensaje de bienvenida
    useEffect(() => {
        const welcomeMessage = t('chatbot.welcome');

        setMessages([
            { role: 'assistant', content: welcomeMessage }
        ]);
    }, [language, t]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Añadir mensaje del usuario
        const userMessage: ChatMessage = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);

        const userInput = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            // Enviar mensaje a la API del chatbot
            const chatResponse = await apiRequest<{ response: ChatMessage, usage: any }>({
                path: '/api/chat',
                method: 'POST',
                body: { messages: [...messages, userMessage].filter(m => m.role !== 'system') }
            });

            if (chatResponse && chatResponse.response) {
                // Añadir respuesta del asistente
                setMessages(prev => [...prev, chatResponse.response]);
            } else {
                throw new Error('No se recibió respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al comunicarse con el chatbot:', error);

            // Mensaje de error para mostrar al usuario
            const errorMessage = t('chatbot.error');

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isOpen,
        setIsOpen,
        messages,
        input,
        setInput,
        isLoading,
        sendMessage
    };
}
