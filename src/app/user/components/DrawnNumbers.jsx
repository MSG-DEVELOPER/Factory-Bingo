
"use client"
import { motion } from 'framer-motion';
import { useBingo } from '@/context_old/BingoContext';
import { getColumnBg, getColumnPastelColor, getColumnGradient } from '@/lib/bingoUtils';
import { Check } from 'lucide-react';

function DrawnNumbers() {
  const { drawnNumbers, currentNumber, winningNumbers } = useBingo();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-900/50 rounded-2xl p-6 mb-8 border border-zinc-700 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-amber-400">🎯</span>
        Números Sacados ({drawnNumbers.length}/75)
      </h2>
      <div className="grid grid-cols-15 gap-2 max-h-40 overflow-y-auto pr-2">
        {Array.from({ length: 75 }, (_, i) => i + 1).map(number => {
          const isDrawn = drawnNumbers.includes(number);
          const isCurrent = currentNumber === number;
          const isWinning = winningNumbers.includes(number);

          return (
            <motion.div
              key={number}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                ...(isWinning && {
                  rotate: [0, 2, -2, 2, 0],
                  transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                })
              }}
              className={`
                relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                transition-all duration-300
                ${isDrawn
                  ? isCurrent
                    ? `${getColumnGradient(number)} text-white shadow-lg scale-110 ring-4 ring-amber-400`
                    : `${getColumnBg(number)} ${getColumnPastelColor(number)} border border-current`
                  : 'bg-zinc-800 text-zinc-400'
                }
                ${isWinning ? 'ring-2 ring-amber-400' : ''}
              `}
            >
              {number}
              {isWinning && (
                <motion.div
                  className="absolute top-0 right-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Check className="w-3 h-3 text-zinc-950" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default DrawnNumbers;