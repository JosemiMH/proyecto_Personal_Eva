import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useChatbot } from '@/hooks/useChatbot';

const ChatBot = () => {
  const { language, t } = useLanguage();
  const {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    sendMessage
  } = useChatbot();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Textos según el idioma
  const placeholderText = String(t('chatbot.placeholder'));
  const sendButtonText = t('chatbot.send');
  const chatTitle = t('chatbot.title');
  const loadingText = t('chatbot.typing');
  const subtitle = t('chatbot.subtitle');
  const suggestionsText = t('chatbot.suggestions');

  return (
    <div id="chatbot-container" className="relative">
      {/* Botón para abrir el chat */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {!isOpen && (
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3 max-w-[200px] text-sm">
            <p className="text-charcoal font-medium">
              {language === 'es'
                ? '¿Necesitas ayuda con tu proyecto wellness?'
                : 'Need help with your wellness project?'}
            </p>
            <button
              className="text-turquoise text-xs mt-1 hover:underline"
              onClick={() => setIsOpen(true)}
            >
              {language === 'es' ? 'Chatea conmigo' : 'Chat with me'}
            </button>

          </div>
        )}
        <motion.button
          className="bg-turquoise text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          aria-label={language === 'es' ? 'Abrir chat' : 'Open chat'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </motion.button>
      </motion.div>

      {/* Ventana de chat */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {/* Cabecera del chat */}
              <div className="bg-turquoise text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{chatTitle}</h3>
                    <p className="text-white/70 text-xs">
                      {subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label={language === 'es' ? 'Cerrar chat' : 'Close chat'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Área de mensajes */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-4"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${msg.role === 'user'
                        ? 'bg-sage/20 text-charcoal'
                        : 'bg-turquoise text-white'
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-500 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        <span className="text-sm ml-2">{loadingText}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sugerencias de preguntas */}
              <div className="px-4 pt-2 pb-0">
                <p className="text-xs text-gray-500 mb-2">
                  {suggestionsText}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    language === 'es' ? '¿Cómo aumentar ingresos en mi spa?' : 'How to increase spa revenue?',
                    language === 'es' ? '¿Qué tendencias wellness hay?' : 'Current wellness trends?',
                    language === 'es' ? '¿Cómo formar a mi equipo?' : 'How to train my team?'
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Área de entrada de texto */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex">
                  <textarea
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-turquoise resize-none"
                    placeholder={placeholderText}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button
                    className="rounded-l-none bg-turquoise hover:bg-turquoise/90"
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0 md:mr-2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span className="hidden md:inline">{sendButtonText}</span>
                  </Button>
                </div>
                <div className="mt-2 text-xs text-center text-gray-500">
                  <p>
                    {t('chatbot.disclaimer')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;