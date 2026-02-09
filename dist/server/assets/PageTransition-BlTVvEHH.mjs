import { jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};
const PageTransition = ({ children }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: "initial",
      animate: "in",
      exit: "out",
      variants: pageVariants,
      transition: pageTransition,
      className: "w-full",
      children
    }
  );
};
export {
  PageTransition as P
};
