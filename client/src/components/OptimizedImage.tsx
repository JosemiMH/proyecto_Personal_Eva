import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
  objectFit = 'cover',
  priority = false,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);

  // Reseteamos el estado si cambia la fuente de la imagen
  useEffect(() => {
    setIsLoading(!priority);
    setImageSrc(src);
    setError(false);
  }, [src, priority]);

  // Manejo de carga y error
  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    // Imagen de respaldo en caso de error
    setImageSrc('https://placehold.co/600x400/e2e8f0/94a3b8?text=Image+not+available');
  };

  // Cargar la imagen antes si es prioritaria
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleError;
    }
  }, [priority, src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <Skeleton 
          className="absolute inset-0 z-10" 
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;
