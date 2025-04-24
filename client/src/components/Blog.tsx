import { motion } from 'framer-motion';
import { blogPosts } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from './OptimizedImage';
import InteractiveCard from './InteractiveCard';
import { ArrowRight } from 'lucide-react';

const Blog = () => {
  const { t, language } = useLanguage();
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

  return (
    <section id="blog" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('blog.title')}</h2>
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-6">
            {t('blog.subtitle')}
          </h3>
          <p className="text-charcoal-light">
            {t('blog.description')}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {blogPosts.map((post, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <OptimizedImage 
                  src={post.image} 
                  alt={post.title[language]} 
                  className="w-full h-full"
                  objectFit="cover"
                  priority={index < 3} // Cargar prioritariamente los primeros 3 posts
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-gray-500">
                    {typeof post.date === 'object' ? post.date[language] : post.date}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs bg-turquoise/10 text-turquoise px-2 py-1 rounded">
                    {typeof post.category === 'object' ? post.category[language] : post.category}
                  </span>
                </div>
                <h4 className="font-playfair text-xl font-bold text-charcoal mb-2 group-hover:text-turquoise transition-colors">
                  {typeof post.title === 'object' ? post.title[language] : post.title}
                </h4>
                <p className="text-charcoal-light text-sm mb-4">
                  {typeof post.excerpt === 'object' ? post.excerpt[language] : post.excerpt}
                </p>
                <a 
                  href="#" 
                  className="text-turquoise hover:text-turquoise-dark font-medium text-sm inline-flex items-center transition-all hover:translate-x-1"
                >
                  {t('blog.readArticle')} 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <motion.a 
            href="#" 
            className="inline-block px-8 py-3 border border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-all duration-300 rounded font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('blog.viewAll')}
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
