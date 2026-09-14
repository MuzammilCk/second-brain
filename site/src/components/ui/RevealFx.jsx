import { motion } from 'framer-motion';

/**
 * RevealFx component inspired by Once UI Magic Portfolio.
 * Provides staggered, smooth scroll & mount animations.
 */
export default function RevealFx({
  children,
  translateY = 16,
  delay = 0,
  duration = 0.65,
  className = '',
  style = {},
  threshold = 0.1,
  once = true,
  ...rest
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: translateY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Once UI smooth cubic bezier
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
