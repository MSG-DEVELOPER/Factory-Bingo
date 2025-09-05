import { useCallback } from 'react';
import { toast } from '../components/ui/use-toast';
import { generateBingoCard75, generateBingoCard90, generateEmptyBingoCard75 } from '../lib/bingoUtils';

export const useGameManagement = ({ state, actions }) => {
  const { 
    playerCards, currentPlayer, players, cardPrice, activePatterns, 
    countdownRef, houseCut, sellerCommission, firstPrizePercentage, bingoType, activeRoom, gameState
  } = state;
  const {
    setGameState, setGameStage, setDrawnNumbers, setCurrentNumber, setAvailableNumbers,
    setIsAutoPlay, setWinningCards, setFirstPrizeWinners, setWinningNumbers,
    setPlayerCards, setFirstPrizePool, setFinalPrizePool, setNextGameCountdown,
    chargeForCards, updatePlayerStats, setHouseEarnings, setEditingCard, setPlayers
  } = actions;

  const resetGame = useCallback((isNewRoomOrCycle = false) => {
    setGameState(activeRoom.nombre === 'general' ? 'countdown' : 'setup');
    setGameStage('first_prize');
    setDrawnNumbers([]);
    setCurrentNumber(null);
    const totalNumbers = bingoType === '75' ? 75 : 90;
    setAvailableNumbers(Array.from({ length: totalNumbers }, (_, i) => i + 1));
    setIsAutoPlay(false);
    setWinningCards([]);
    setFirstPrizeWinners([]);
    setWinningNumbers([]);
    setFirstPrizePool(0);
    setFinalPrizePool(0);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setNextGameCountdown(null);
    
    if (isNewRoomOrCycle && setPlayers) {
      setPlayers(prevPlayers => prevPlayers.map(p => ({ ...p, cards: [] })));
    }
  }, [
    bingoType, activeRoom, setGameState, setGameStage, setDrawnNumbers, setCurrentNumber, setAvailableNumbers,
    setIsAutoPlay, setWinningCards, setFirstPrizeWinners, setWinningNumbers,
    setFirstPrizePool, setFinalPrizePool, setNextGameCountdown, countdownRef, setPlayers
  ]);

  const addCard = useCallback((type = 'auto') => {
    if (gameState === 'playing' || gameState === 'finished') {
      toast({
        title: "¡Demasiado tarde!",
        description: "Ya no se pueden añadir más cartones para esta partida.",
        variant: "destructive",
      });
      return;
    }
    if (!currentPlayer) return;
    const player = players.find(p => p.id === currentPlayer.id);
    if (player && player.balance < cardPrice) {
      toast({
        title: "Saldo insuficiente",
        description: "No tienes suficientes fichas para comprar un nuevo cartón.",
        variant: "destructive",
      });
      return;
    }

    chargeForCards(currentPlayer.id, cardPrice);
    updatePlayerStats(currentPlayer.id, { cardsPlayed: 1 });

    const prizeContribution = cardPrice * ((100 - houseCut) / 100);
    const firstPrize = prizeContribution * (firstPrizePercentage / 100);
    const finalPrize = prizeContribution - firstPrize;

    setFirstPrizePool(prev => prev + firstPrize);
    setFinalPrizePool(prev => prev + finalPrize);
    setHouseEarnings(prev => prev + (cardPrice - prizeContribution));

    let newCard;
    if (type === 'manual' && bingoType === '75') {
      newCard = generateEmptyBingoCard75();
      setEditingCard(newCard);
    } else {
      newCard = bingoType === '75' ? generateBingoCard75() : generateBingoCard90();
    }
    
    newCard.originalIndex = playerCards.length;
    setPlayerCards(prev => [...prev, newCard]);
  }, [
    gameState, currentPlayer, players, cardPrice, bingoType, setPlayerCards, setEditingCard, 
    chargeForCards, updatePlayerStats, houseCut, firstPrizePercentage, 
    setFirstPrizePool, setFinalPrizePool, setHouseEarnings
  ]);

  const removeCard = useCallback((cardId) => {
    if (gameState !== 'setup' && gameState !== 'countdown') return;

    const cardToRemove = playerCards.find(c => c.id === cardId);
    if (!cardToRemove) return;

    chargeForCards(currentPlayer.id, -cardPrice);
    updatePlayerStats(currentPlayer.id, { cardsPlayed: -1 });

    const prizeContribution = cardPrice * ((100 - houseCut) / 100);
    const firstPrize = prizeContribution * (firstPrizePercentage / 100);
    const finalPrize = prizeContribution - firstPrize;

    setFirstPrizePool(prev => Math.max(0, prev - firstPrize));
    setFinalPrizePool(prev => Math.max(0, prev - finalPrize));
    setHouseEarnings(prev => Math.max(0, prev - (cardPrice - prizeContribution)));

    setPlayerCards(prev => prev.filter(card => card.id !== cardId));
  }, [
    gameState, playerCards, currentPlayer, cardPrice, chargeForCards, updatePlayerStats, 
    houseCut, firstPrizePercentage, setFirstPrizePool, setFinalPrizePool, setHouseEarnings, setPlayerCards
  ]);
  
  const clearAllPlayerCards = useCallback(() => {
    if (!currentPlayer || (gameState !== 'setup' && gameState !== 'countdown')) return;

    const numCards = playerCards.length;
    if (numCards === 0) return;

    const totalRefund = numCards * cardPrice;

    chargeForCards(currentPlayer.id, -totalRefund);
    updatePlayerStats(currentPlayer.id, { cardsPlayed: -numCards });

    const prizeContribution = cardPrice * ((100 - houseCut) / 100);
    const firstPrize = prizeContribution * (firstPrizePercentage / 100);
    const finalPrize = prizeContribution - firstPrize;

    setFirstPrizePool(prev => Math.max(0, prev - (firstPrize * numCards)));
    setFinalPrizePool(prev => Math.max(0, prev - (finalPrize * numCards)));
    setHouseEarnings(prev => Math.max(0, prev - ((cardPrice - prizeContribution) * numCards)));

    setPlayerCards([]);

    toast({
      title: "Cartones eliminados",
      description: `Se han eliminado ${numCards} cartones y se te han devuelto ${totalRefund.toFixed(2)} fichas.`,
    });
  }, [gameState, currentPlayer, playerCards, cardPrice, chargeForCards, updatePlayerStats, houseCut, firstPrizePercentage, setFirstPrizePool, setFinalPrizePool, setHouseEarnings, setPlayerCards]);

  const toggleCardMode = useCallback((cardId) => {
    setPlayerCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, type: card.type === 'auto' ? 'manual' : 'auto' } : card
    ));
  }, [setPlayerCards]);

  const updatePlayerCard = useCallback((cardId, newNumbers) => {
    setPlayerCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, numbers: newNumbers, marked: Array(25).fill(false) } : card
    ));
  }, [setPlayerCards]);

  const startGame = useCallback((isGeneralRoom = false) => {
    const playersWithCards = players.filter(p => p.cards?.length > 0);
    const playersToProcess = isGeneralRoom ? playersWithCards : (currentPlayer ? [players.find(p => p.id === currentPlayer.id)] : []);

    // if (playersToProcess.length === 0 || !playersToProcess[0] || playersToProcess.every(p => !p.cards || p.cards.length === 0)) {
    //   toast({ title: "Nadie ha comprado cartones", description: "La partida no puede empezar sin jugadores.", variant: "destructive" });
    //   if (isGeneralRoom) {
    //     resetGame(true);
    //   }
    //   return;
    // }
    
    const firstPrizePatterns = activePatterns?.firstPrize || {};
    const finalPrizePatterns = activePatterns?.finalPrize || {};

    if (Object.keys(firstPrizePatterns).length === 0 && Object.keys(finalPrizePatterns).length === 0) {
      toast({
        title: "¡Acción requerida!",
        description: "Debes activar al menos un patrón de ganancias para empezar el juego.",
        variant: "destructive",
      });
      return;
    }
    
    playersToProcess.forEach(player => {
      updatePlayerStats(player.id, { gamesPlayed: 1 });
    });
    
    console.log(`
      --- INICIO DE PARTIDA ---
      Sala: ${activeRoom.nombre} (ID: ${activeRoom.nombre})
      Inicio: ${new Date().toLocaleString()}
      Participantes:
      ${playersToProcess.map(p => `  - ${p.name} (ID: ${p.id}) compró ${p.cards.length} cartones`).join('\n')}
      -------------------------
    `);
    
    setGameState('playing');
    setGameStage('first_prize');
    if (isGeneralRoom) {
      setIsAutoPlay(true);
    }
    toast({
      title: "¡Partida iniciando...!",
      description: `¡Buena suerte a todos!`,
    });
  }, [
    currentPlayer, players, activePatterns, updatePlayerStats, setGameState, setGameStage, activeRoom, resetGame, setIsAutoPlay
  ]);

  return {
    addCard,
    removeCard,
    toggleCardMode,
    updatePlayerCard,
    startGame,
    resetGame,
    clearAllPlayerCards,
  };
};