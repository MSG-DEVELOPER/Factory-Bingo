"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { Award, Trophy } from 'lucide-react';

function WinningPatterns({ currentStage }) {
  const { activePatterns } = useBingo();
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);

  const patternsForStage = currentStage === 'first_prize' ? activePatterns.firstPrize : activePatterns.finalPrize;
  const activePatternEntries = patternsForStage ? Object.entries(patternsForStage) : [];

  const stageInfo = {
    first_prize: {
      title: "Primer Premio",
      icon: <Award className="text-amber-400" />,
      color: "border-amber-400"
    },
    final_prize: {
      title: "¡A por el Bingo!",
      icon: <Trophy className="text-yellow-300" />,
      color: "border-yellow-300"
    }
  };

  const currentStageInfo = stageInfo[currentStage] || stageInfo.first_prize;

  useEffect(() => {
    if (activePatternEntries.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPatternIndex((prevIndex) => (prevIndex + 1) % activePatternEntries.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activePatternEntries.length]);

  useEffect(() => {
    setCurrentPatternIndex(0);
  }, [currentStage]);


  if (!activePatterns || activePatternEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg w-full text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Award className="text-amber-400" />
          Formas de Ganar
        </h2>
        <p className="text-white/70">No hay patrones de victoria activos.</p>
      </motion.div>
    );
  }

  const [name, pattern] = activePatternEntries[currentPatternIndex];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border shadow-lg w-full transition-colors duration-500 ${currentStageInfo.color}`}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
        {currentStageInfo.icon}
        {currentStageInfo.title}
      </h2>
      <div className="relative h-36 sm:h-48 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center"
          >
            <div className={`grid grid-cols-5 gap-1 sm:gap-2 mx-auto w-28 h-28 sm:w-36 sm:h-36 mb-2 p-2 bg-zinc-800/50 rounded-lg border border-white/10`}>
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-full h-full rounded-sm transition-colors duration-300 ${pattern.includes(index) ? (currentStage === 'first_prize' ? 'bg-amber-400' : 'bg-yellow-300') : 'bg-white/20'}`}
                ></div>
              ))}
            </div>
            <p className="text-sm font-semibold text-white/90 tracking-wider">{name}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default WinningPatterns;