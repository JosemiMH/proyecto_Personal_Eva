import { useState } from 'react';
import { motion } from 'framer-motion';
import { resources } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResourcesProps {
  isPage?: boolean;
}

const Resources = ({ isPage = false }: ResourcesProps) => {
  const { t, language } = useLanguage();
  const [selectedResource, setSelectedResource] = useState<typeof resources[0] | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const TitleTag = isPage ? 'h1' : 'h2';
  const SubtitleTag = isPage ? 'h2' : 'h3';

  return (
    <section className={`py-16 md:py-24 bg-white ${isPage ? 'pt-32' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TitleTag className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('resources.title')}</TitleTag>
          <SubtitleTag className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
            {t('resources.subtitle')}
          </SubtitleTag>
          <p className="text-charcoal-light">
            {language === 'es'
              ? 'Accede a guías y recursos exclusivos para optimizar la gestión de tu spa. Lectura directa y práctica.'
              : 'Access exclusive guides and resources to optimize your spa management. Direct and practical reading.'}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover-scale flex flex-col h-full cursor-pointer group"
              variants={itemVariants}
              onClick={() => setSelectedResource(resource)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={resource.image}
                  alt={typeof resource.title === 'object' ? resource.title[language] : resource.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-playfair text-xl font-bold text-charcoal mb-2">
                  {typeof resource.title === 'object' ? resource.title[language] : resource.title}
                </h4>
                <p className="text-charcoal-light text-sm mb-4 flex-grow">
                  {typeof resource.description === 'object' ? resource.description[language] : resource.description}
                </p>
                <div className="mt-auto">
                  <span
                    className="inline-block w-full bg-turquoise hover:bg-turquoise-dark text-white text-center font-medium py-2 rounded transition-colors"
                  >
                    {typeof resource.buttonText === 'object' ? resource.buttonText[language] : resource.buttonText}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
            {selectedResource && (
              <>
                <div className="relative h-64 w-full">
                  <img
                    src={selectedResource.image}
                    alt="Resource header"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <DialogTitle className="font-playfair text-2xl md:text-3xl font-bold leading-tight">
                      {typeof selectedResource.title === 'object' ? selectedResource.title[language] : selectedResource.title}
                    </DialogTitle>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="prose prose-lg prose-headings:font-playfair prose-headings:text-charcoal prose-p:text-charcoal-light prose-li:text-charcoal-light max-w-none">
                    <ReactMarkdown>
                      {Array.isArray(selectedResource.content[language])
                        ? selectedResource.content[language].join('\n\n')
                        : selectedResource.content[language]}
                    </ReactMarkdown>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Resources;
