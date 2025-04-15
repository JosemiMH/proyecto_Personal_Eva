import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          language === 'es' ? 'bg-turquoise text-white' : 'bg-gray-200 text-gray-600'
        } hover:bg-turquoise hover:text-white transition-colors text-xs font-medium`}
        onClick={() => setLanguage('es')}
        aria-label="Cambiar a español"
      >
        ES
      </button>
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          language === 'en' ? 'bg-turquoise text-white' : 'bg-gray-200 text-gray-600'
        } hover:bg-turquoise hover:text-white transition-colors text-xs font-medium`}
        onClick={() => setLanguage('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;