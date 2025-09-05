
import { useEffect } from 'react';
import { toast } from './components/ui/use-toast';

export const useGameEffects = ({ state, actions, refs }) => {
  const {
    isAutoPlay,
    gameState,
    autoPlaySpeed,
    nextGameCountdown,
    drawnNumbers,
    playerCards,
    gameStage,
  } = state;
  const { drawNextNumber, resetGame, updateAndSortCards, setPlayerCards, setNextGameCountdown } = actions;
  const { autoPlayRef, countdownRef } = refs;

  useEffect(() => {
    if (isAutoPlay && gameState === 'playing') {
      const effectiveSpeed = Math.max(autoPlaySpeed, 1000);
      autoPlayRef.current = setInterval(drawNextNumber, effectiveSpeed);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, gameState, autoPlaySpeed, drawNextNumber, autoPlayRef]);

  useEffect(() => {
    if (nextGameCountdown !== null && nextGameCountdown > 0) {
      countdownRef.current = setInterval(() => {
        setNextGameCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (nextGameCountdown === 0) {
      if (countdownRef.current) clearInterval(countdownRef.current);
      resetGame();
      toast({
        title: "Nueva Partida",
        description: "¡El juego ha sido reiniciado! Prepara tus cartones.",
      });
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [nextGameCountdown, resetGame, countdownRef, setNextGameCountdown]);

  useEffect(() => {
    if (gameState === 'playing') {
      setPlayerCards(cards => updateAndSortCards(cards));
    }
  }, [drawnNumbers, gameState, gameStage, updateAndSortCards, setPlayerCards]);
};
