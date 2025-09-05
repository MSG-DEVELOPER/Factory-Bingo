
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getColumnLetter, generateBingoCard75, generateBingoCard90 } from '../lib/bingoUtils';
import { voices, voiceOptions } from '../lib/voices';
import { useGameActions } from './useGameActions';
import { useGameEffects } from './useGameEffects';
import { useGameManagement } from './useGameManagement';

export const useGameLogic = (userManagement, settings, roomManagement, houseEarnings, setHouseEarnings) => {
  const { players, setPlayers, currentPlayer, chargeForCards, updatePlayerStats, saveFavoriteCard: saveFavoriteCardUser, addFavoriteCardToGame: addFavoriteCardToGameUser } = userManagement;
  const { activePatterns: globalActivePatterns, selectedVoice, gameMode, bingoType } = settings;
  const { activeRoom } = roomManagement;

  const [gameState, setGameState] = useState(null);
  const [gameStage, setGameStage] = useState(null);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  
  // const totalNumbers = useMemo(() => bingoType === '75' ? 75 : 90, [bingoType]);
  const totalNumbers = useMemo(() => bingoType === 90, [bingoType]);
  const [availableNumbers, setAvailableNumbers] = useState(Array.from({ length: totalNumbers }, (_, i) => i + 1));
  
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [winningCards, setWinningCards] = useState([]);
  const [firstPrizeWinners, setFirstPrizeWinners] = useState([]);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [firstPrizePool, setFirstPrizePool] = useState(0);
  const [finalPrizePool, setFinalPrizePool] = useState(0);
  const [nextGameCountdown, setNextGameCountdown] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  const autoPlayRef = useRef(null);
  const countdownRef = useRef(null);
  const audioRef = useRef(null);
  
  const activePatterns = useMemo(() => activeRoom?.patterns || globalActivePatterns, [activeRoom, globalActivePatterns]);
  const cardPrice = activeRoom ? activeRoom.cardPrice : settings.cardPrice;
  const autoPlaySpeed = activeRoom ? activeRoom.autoPlaySpeed : settings.autoPlaySpeed;

  const playerCards = useMemo(() => {
    return currentPlayer ? players.find(p => p.id === currentPlayer.id)?.cards || [] : [];
  }, [players, currentPlayer]);

  const setPlayerCards = useCallback((updater) => {
    if (!currentPlayer) return;
    setPlayers(prevPlayers => prevPlayers.map(p => {
      if (p.id === currentPlayer.id) {
        const currentCards = p.cards || [];
        const newCards = typeof updater === 'function' ? updater(currentCards) : updater;
        return { ...p, cards: newCards };
      }
      return p;
    }));
  }, [currentPlayer, setPlayers]);

  const actions = useGameActions({
    state: { players, drawnNumbers, gameStage, firstPrizeWinners, winningCards, firstPrizePool, finalPrizePool, activePatterns, gameMode, availableNumbers, currentPlayer, gameState, bingoType },
    actions: { 
      setPlayers, setGameStage, setFirstPrizeWinners, setWinningCards, setGameState, 
      updatePlayerStats,
      setDrawnNumbers, setCurrentNumber, setAvailableNumbers,
      setPlayerCards, setWinningNumbers
    }
  });

  const gameManagement = useGameManagement({
    state: { playerCards, currentPlayer, players, cardPrice, activePatterns, countdownRef, houseCut: settings.houseCut, sellerCommission: settings.sellerCommission, firstPrizePercentage: settings.firstPrizePercentage, bingoType, activeRoom, gameState },
 
    actions: {
      setGameState, setGameStage, setDrawnNumbers, setCurrentNumber, setAvailableNumbers,
      setIsAutoPlay, setWinningCards, setFirstPrizeWinners, setWinningNumbers,
      setPlayerCards, setFirstPrizePool, setFinalPrizePool, setNextGameCountdown,
      chargeForCards, updatePlayerStats, setHouseEarnings, setEditingCard, setPlayers
    }
  });
  
  
  useEffect(() => {
    if (!activeRoom) {
      setGameState('setup');
      return;
    }
    if (activeRoom.id !== 'general') {
      gameManagement.resetGame(true);
    }
    setAvailableNumbers(Array.from({ length: totalNumbers }, (_, i) => i + 1));
  }, [bingoType, totalNumbers, activeRoom]);

  useGameEffects({
    state: { isAutoPlay, gameState, autoPlaySpeed, nextGameCountdown, drawnNumbers, playerCards, gameStage },
    actions: { drawNextNumber: actions.drawNumber, resetGame: gameManagement.resetGame, updateAndSortCards: actions.updateAndSortCards, setPlayerCards, setNextGameCountdown },
    refs: { autoPlayRef, countdownRef }
  });

  useEffect(() => {
    if (gameState === 'playing' && activeRoom.nombre === 'general' && !isAutoPlay) {
        setIsAutoPlay(true);
    }
  }, [gameState, activeRoom, isAutoPlay]);
  
  const announcer = useMemo(() => {
    const activeVoiceId = selectedVoice === 'random' 
      ? voiceOptions.filter(v => v.id !== 'random')[Math.floor(Math.random() * (voiceOptions.length - 1))].id
      : selectedVoice;

    const voice = voices[activeVoiceId] || voices.professional;

    const speak = (number) => {
      if (!number) return;
      const letter = getColumnLetter(number, bingoType);
      
      const audioPath = voice.getAudioPath(letter, number);
      if (audioPath) {
        try {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          audioRef.current = new Audio(audioPath);
          audioRef.current.play().catch(e => console.error("Error playing sound:", e));

          const phrase = voice.getRandomPhrase(number);
          if (phrase && window.speechSynthesis) {
            setTimeout(() => {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(phrase);
              utterance.lang = voice.lang;
              utterance.pitch = voice.pitch;
              utterance.rate = voice.rate;
              window.speechSynthesis.speak(utterance);
            }, 700);
          }
        } catch (e) {
            console.error("Could not play audio:", e);
        }
      }
    };
    return { speak };
  }, [selectedVoice, bingoType]);


  useEffect(() => {
    if (currentNumber !== null && gameState === 'playing') {
      announcer.speak(currentNumber);
    }
  }, [currentNumber, gameState, announcer]);

  const handleMarkNumber = (cardId, numberIndex) => {
    if (gameState !== 'playing' || !currentPlayer) return;
    actions.handleManualMark(cardId, numberIndex);
  };
  
  const regenerateCard = (cardId) => {
    setPlayerCards(prev => prev.map(card => {
        if (card.id === cardId) {
            // const newCard = bingoType === '75' ? generateBingoCard75() : generateBingoCard90();
            const newCard =  generateBingoCard90();
            return {
                ...card,
                numbers: newCard.numbers,
                marked: newCard.marked
            };
        }
        return card;
    }));
  };

  const prizePool = firstPrizePool + finalPrizePool;

  return {
    gameState,
    setGameState,
    gameStage,
    drawnNumbers,
    currentNumber,
    isAutoPlay,
    setIsAutoPlay,
    winningCards,
    firstPrizeWinners,
    winningNumbers,
    firstPrizePool,
    finalPrizePool,
    prizePool,
    nextGameCountdown,
    editingCard,
    setEditingCard,
    playerCards,
    startGame: gameManagement.startGame,
    resetGame: gameManagement.resetGame,
    addCard: gameManagement.addCard,
    removeCard: gameManagement.removeCard,
    clearAllPlayerCards: gameManagement.clearAllPlayerCards,
    regenerateCard,
    toggleCardMode: gameManagement.toggleCardMode,
    updatePlayerCard: gameManagement.updatePlayerCard,
    drawNextNumber: actions.drawNumber,
    handleMarkNumber,
    activePatterns,
    saveFavoriteCard: saveFavoriteCardUser,
    addFavoriteCardToGame: addFavoriteCardToGameUser,
  };
};
