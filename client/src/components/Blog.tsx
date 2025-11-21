import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from './OptimizedImage';
import { ArrowRight, Clock, Tag, X } from 'lucide-react';

const Blog = () => {
  const { t, language } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="blog" className="py-20 md:py-32 bg-gray-50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm uppercase tracking-wider text-turquoise font-medium mb-3">{t('blog.title')}</h2>
          <h3 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
            {t('blog.subtitle')}
          </h3>
          <p className="text-charcoal-light text-lg">
            {t('blog.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                } ${index === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              variants={itemVariants}
              onClick={() => setSelectedPost(post)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <OptimizedImage
                  src={post.image}
                  alt={typeof post.title === 'object' ? post.title[language] : post.title}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                  objectFit="cover"
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-white/80 text-xs font-medium uppercase tracking-wider">
                    <span className="bg-turquoise/90 text-white px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {typeof post.category === 'object' ? post.category[language] : post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(post as any).readTime ? ((post as any).readTime[language]) : '5 min read'}
                    </span>
                    <span>•</span>
                    <span>{typeof post.date === 'object' ? post.date[language] : post.date}</span>
                  </div>

                  <h4 className={`font-playfair font-bold text-white mb-3 leading-tight group-hover:text-turquoise-light transition-colors ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'
                    }`}>
                    {typeof post.title === 'object' ? post.title[language] : post.title}
                  </h4>

                  <p className="text-gray-200 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {typeof post.excerpt === 'object' ? post.excerpt[language] : post.excerpt}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                    className="inline-flex items-center text-white font-medium group/link"
                  >
                    <span className="border-b border-turquoise pb-1 group-hover/link:border-white transition-colors">
                      {t('blog.readArticle')}
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-16">
          <motion.a
            href="#"
            className="inline-block px-10 py-4 border-2 border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-all duration-300 rounded-full font-medium tracking-wide uppercase text-sm"
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
