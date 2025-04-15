import { useLanguage } from '@/contexts/LanguageContext';
import spainFlag from '@/assets/flags/spain.svg';
import ukFlag from '@/assets/flags/uk.svg';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden ${
          language === 'es' ? 'ring-2 ring-turquoise' : 'ring-1 ring-gray-300'
        } hover:ring-2 hover:ring-turquoise transition-all`}
        onClick={() => setLanguage('es')}
        aria-label="Cambiar a español"
      >
        <img src={spainFlag} alt="Bandera de España" className="w-full h-full object-cover" />
      </button>
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full overflow-hidden ${
          language === 'en' ? 'ring-2 ring-turquoise' : 'ring-1 ring-gray-300'
        } hover:ring-2 hover:ring-turquoise transition-all`}
        onClick={() => setLanguage('en')}
        aria-label="Switch to English"
      >
        <img src={ukFlag} alt="UK Flag" className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;