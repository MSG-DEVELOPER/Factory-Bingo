
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Sparkles, PartyPopper } from 'lucide-react';

const GameStartCountdownModal = () => {
  const { preGameCountdown, activeRoom } = useBingo();

  const showModal = preGameCountdown == null && activeRoom.nombre === 'general';

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { scale: 0.5, opacity: 0, y: 100 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
    exit: { scale: 0.5, opacity: 0, y: 100, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            variants={modalVariants}
            className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-zinc-700 w-11/12 max-w-md relative overflow-hidden"
          >
            <Sparkles className="absolute -top-4 -left-4 w-16 h-16 text-amber-400/30" />
            <PartyPopper className="absolute -bottom-4 -right-4 w-16 h-16 text-sky-400/30" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-4">
              ¡El juego va a comenzar!
            </h2>
            <p className="text-zinc-300 mb-8 text-lg">Prepárate para la acción...</p>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <motion.div
                className="absolute inset-0 border-8 border-sky-500/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 border-4 border-dashed border-amber-500/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={preGameCountdown}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="text-8xl font-black text-white"
                >
                  {preGameCountdown}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-8 text-zinc-400 text-sm">¡Mucha suerte a todos los jugadores!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameStartCountdownModal;
