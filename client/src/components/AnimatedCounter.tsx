import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (isInView && !hasAnimated) {
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
  }, [isInView, end, duration, hasAnimated]);
  
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
