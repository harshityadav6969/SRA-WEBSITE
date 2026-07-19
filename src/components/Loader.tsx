import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark text-brand-light"
      id="loader-screen"
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Ambient Background */}
        <div className="absolute -inset-10 bg-brand-green/20 rounded-full blur-3xl opacity-60 animate-pulse" />

        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: [0.8, 1.05, 1], opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green to-emerald-600 shadow-[0_0_40px_rgba(13,92,52,0.3)]"
          id="loader-logo-icon"
        >
          <Leaf className="h-10 w-10 text-brand-light" />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl"
          id="loader-title"
        >
          SRA SHRIJI AGRI GENETICS SEEDS PVT LTD
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-2 font-serif text-lg italic text-brand-amber tracking-wider"
          id="loader-tagline"
        >
          Growing Tomorrow.
        </motion.p>

        {/* Progress Line */}
        <div className="mt-12 h-[1px] w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-full w-full bg-gradient-to-r from-transparent via-brand-amber to-transparent"
          />
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 1 }}
          onClick={onComplete}
          className="mt-16 text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-300"
          id="loader-skip-btn"
        >
          Skip Experience
        </motion.button>
      </div>
    </motion.div>
  );
}
