import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter = ({
  end,
  duration = 2,
  label,
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) => {
  // Render the real figure in SSR so search engines and no-JS users never see
  // a misleading "0+". The animation starts only after hydration.
  const [count, setCount] = useState(end);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  useEffect(() => {
    if (isHydrated && isInView && !hasAnimated) {
      if (reduceMotion) {
        setCount(end);
        setHasAnimated(true);
        return;
      }

      setCount(0);
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setHasAnimated(true);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isHydrated, isInView, end, duration, hasAnimated, reduceMotion]);
  
  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-turquoise mb-2">
        {`${prefix}${count}${suffix}`}
      </div>
      <p className="text-charcoal-light text-sm md:text-base">{label}</p>
    </motion.div>
  );
};

export default AnimatedCounter;
