import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from './OptimizedImage';
import { ArrowRight, Clock, Tag, Calendar, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

import { blogPosts } from '@/lib/constants';

// ... (imports)

const Blog = () => {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { data: apiArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Fallback to constants if API returns empty or fails
  const articles = (apiArticles && apiArticles.length > 0)
    ? apiArticles
    : blogPosts.map((post, index) => ({
      id: index + 1000,
      slug: `post-${index}`,
      title: post.title[language as 'es' | 'en'],
      content: post.content[language as 'es' | 'en'].join('\n\n'),
      excerpt: post.excerpt[language as 'es' | 'en'],
      image: post.image,
      category: post.category[language as 'es' | 'en'],
      readTime: post.readTime[language as 'es' | 'en'],
      date: new Date().toISOString() // Use current date as fallback since format might differ
    }));

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

  if (isLoading) {
    return (
      <section id="blog" className="py-20 md:py-32 bg-gray-50 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise mx-auto"></div>
        </div>
      </section>
    );
  }

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
          {articles?.map((post, index) => (
            <motion.div
              key={post.id}
              className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                } ${index === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              variants={itemVariants}
              onClick={() => setSelectedArticle(post)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
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
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{new Date(post.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</span>
                  </div>

                  <h4 className={`font-playfair font-bold text-white mb-3 leading-tight group-hover:text-turquoise-light transition-colors ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'
                    }`}>
                    {post.title}
                  </h4>

                  <p className="text-gray-200 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {post.excerpt}
                  </p>

                  <button
                    className="inline-flex items-center text-white font-medium group/link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(post);
                    }}
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

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selectedArticle && (
            <>
              <div className="relative h-64 md:h-80 w-full">
                <OptimizedImage
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="flex items-center gap-4 mb-3 text-sm font-medium uppercase tracking-wider">
                    <span className="bg-turquoise/90 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {selectedArticle.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedArticle.readTime}
                    </span>
                  </div>
                  <DialogTitle className="font-playfair text-2xl md:text-4xl font-bold leading-tight">
                    {selectedArticle.title}
                  </DialogTitle>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-charcoal-light mb-6 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedArticle.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                <div className="prose prose-lg prose-headings:font-playfair prose-headings:text-charcoal prose-p:text-charcoal-light prose-a:text-turquoise hover:prose-a:text-turquoise-dark max-w-none">
                  <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Blog;
