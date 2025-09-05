"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { getColumnLetter, getColumnGradient } from '../lib/bingoUtils';

const CurrentBingoBall = () => {
  const { currentNumber, bingoType } = useBingo();

  const ballVariants = {
    initial: { opacity: 0, y: -50, scale: 0.5 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 15,
        rotate: {
          duration: 0.5,
          ease: "easeInOut"
        }
      }
    },
    exit: { opacity: 0, y: 50, scale: 0.5, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-zinc-100 mb-4">Última Bola</h3>
      <div className="w-24 h-24 sm:w-32 sm:h-32">
        <AnimatePresence mode="wait">
          {currentNumber && (
            <motion.div
              key={currentNumber}
              variants={ballVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full rounded-full flex flex-col items-center justify-center shadow-2xl relative"
              style={{
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(255,255,255,0) 50%), ${getColumnGradient(currentNumber, bingoType).replace('bg-gradient-to-br ', '')}`
              }}
            >
              <div className={`absolute inset-0 rounded-full ${getColumnGradient(currentNumber, bingoType)}`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/30 rounded-full"></div>
              <span className="text-white text-lg sm:text-xl font-black relative" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {getColumnLetter(currentNumber, bingoType)}
              </span>
              <span className="text-white text-4xl sm:text-5xl font-black relative" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {currentNumber}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrentBingoBall;