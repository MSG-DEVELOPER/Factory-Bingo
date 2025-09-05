"use client"
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import useWindowSize from '../hooks_old/useWindowSize';
import { useBingo } from '../context/BingoContext';

const WinnerCelebration = () => {
  const { width, height } = useWindowSize();
  const { nextGameCountdown } = useBingo();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const congratulationsAudio = new Audio('/sounds/congratulations.mp3');
    const applauseAudio = new Audio('/sounds/applause.mp3');
    
    congratulationsAudio.volume = 0.7;
    applauseAudio.volume = 0.6;

    congratulationsAudio.play();
    applauseAudio.play();

    const timer = setTimeout(() => setShow(false), 8000);

    return () => {
      clearTimeout(timer);
      congratulationsAudio.pause();
      applauseAudio.pause();
    };
  }, []);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!show) return null;

  return (
    <>
      {width && height && <Confetti width={width} height={height} recycle={false} numberOfPieces={600} gravity={0.3} />}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="text-center"
        >
          <motion.h2 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 10}}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse"
            style={{ textShadow: '0 0 20px rgba(252, 211, 77, 0.5)' }}
          >
            ¡BINGO!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl sm:text-2xl md:text-4xl text-white mt-4 font-semibold"
          >
            ¡Felicidades, has ganado!
          </motion.p>
           {nextGameCountdown !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 bg-black/50 p-4 rounded-xl"
            >
              <p className="text-lg text-white/80">Próxima partida en:</p>
              <p className="text-4xl font-bold text-sky-400">{formatTime(nextGameCountdown)}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default WinnerCelebration;