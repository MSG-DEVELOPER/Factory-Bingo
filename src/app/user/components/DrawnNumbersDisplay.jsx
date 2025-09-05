
import { motion } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { getColumnGradient } from '../lib/bingoUtils';

function DrawnNumbersDisplay({ drawnNumbers = [], currentNumber }) {
  const { bingoType } = useBingo();
  const totalNumbers = bingoType === '75' ? 75 : 90;
  const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  const gridColsClass = bingoType === '75' ? 'grid-cols-15' : 'grid-cols-10 md:grid-cols-15';

  return (
    <div className="bg-zinc-900/50 rounded-xl shadow-lg p-4 border border-zinc-700">
      <h3 className="text-lg font-bold text-center mb-4 text-white">Números Marcados ({drawnNumbers.length}/{totalNumbers})</h3>
      <motion.div
        className={`grid ${gridColsClass} gap-1 sm:gap-2`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {numbers.map((number) => {
          const isDrawn = drawnNumbers.includes(number);
          const isCurrent = number === currentNumber;
          return (
            <motion.div
              key={number}
              variants={itemVariants}
              className={`
                w-full aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm font-bold
                transition-all duration-300
                ${isDrawn
                  ? isCurrent
                    ? `${getColumnGradient(number, bingoType)} text-white shadow-lg scale-110 ring-2 ring-amber-400`
                    : `${getColumnGradient(number, bingoType)} text-white shadow-md`
                  : 'bg-zinc-800 text-zinc-500'
                }
              `}
              animate={isCurrent ? { scale: [1, 1.25, 1], transition: { duration: 0.5, repeat: Infinity } } : {}}
            >
              {number}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default DrawnNumbersDisplay;