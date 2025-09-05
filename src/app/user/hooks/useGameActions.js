
import { useCallback } from 'react';
import { toast } from './components/ui/use-toast';
import { checkBingo, calculateNumbersToWin } from '../lib/bingoUtils';

export const useGameActions = ({ state, actions }) => {
  const { 
    players, drawnNumbers, gameStage, firstPrizeWinners, winningCards, 
    firstPrizePool, finalPrizePool, activePatterns, gameMode, availableNumbers, 
    currentPlayer, bingoType, gameState
  } = state;
  const { 
    setPlayers, setGameStage, setFirstPrizeWinners, setWinningCards, setGameState, 
    updatePlayerStats, setDrawnNumbers, setCurrentNumber, setAvailableNumbers,
    setPlayerCards, setWinningNumbers
  } = actions;

  const announceWinner = useCallback((player, prize, prizeName) => {
    toast({
      title: `🎉 ¡BINGO! ¡${prizeName}! 🎉`,
      description: `${player.name} ha ganado ${prize.toFixed(2)} fichas.`,
      duration: 5000,
    });
    updatePlayerStats(player.id, {
      wins: 1,
      totalWinnings: prize,
    });
  }, [updatePlayerStats]);

  const updateAndSortCards = useCallback((cards) => {
    if (gameState !== 'playing' || !cards) return cards || [];
    const patternsToCheck = gameStage === 'first_prize' ? activePatterns.firstPrize : activePatterns.finalPrize;
    if (!patternsToCheck || Object.keys(patternsToCheck).length === 0) {
      return cards.map(card => ({ ...card, numbersToWin: 0 }));
    }

    const updatedCards = cards.map(card => ({
      ...card,
      numbersToWin: calculateNumbersToWin(card, patternsToCheck, bingoType)
    }));

    updatedCards.sort((a, b) => a.numbersToWin - b.numbersToWin);
    return updatedCards;
  }, [gameStage, activePatterns, gameState, bingoType]);

  const checkForBingo = useCallback((player, card) => {
    if (gameState !== 'playing') return;
    const patternsToCheck = gameStage === 'first_prize' ? activePatterns.firstPrize : activePatterns.finalPrize;
    if (!patternsToCheck || Object.keys(patternsToCheck).length === 0) return;
    
    const bingoResult = checkBingo(card, patternsToCheck, bingoType);

    if (!bingoResult.isBingo) return;
    
    const prizeNameMapping = {
      '75': { first_prize: "Primer Premio", final_prize: "Cartón Lleno" },
      '90': { first_prize: "Una Línea", final_prize: "Bingo" }
    };
    const prizeNames = prizeNameMapping[bingoType] || prizeNameMapping['75'];

    if (gameStage === 'first_prize') {
        const isAlreadyWinner = firstPrizeWinners.some(winner => winner.player.id === player.id);
        if (isAlreadyWinner) return;

        setFirstPrizeWinners(prev => {
            const newWinners = [...prev, { player, card, pattern: bingoResult.pattern, cardId: card.id, patternName: bingoResult.patternName }];
            const prizePerWinner = firstPrizePool / newWinners.length;
            
            announceWinner(player, prizePerWinner, prizeNames.first_prize);

            setWinningNumbers(currentWinningNumbers => {
                const cardNumbers = card.numbers;
                const patternNumbers = bingoResult.pattern.map(i => cardNumbers[i]).filter(n => typeof n === 'number');
                const uniqueNewNumbers = patternNumbers.filter(n => !currentWinningNumbers.includes(n));
                return [...currentWinningNumbers, ...uniqueNewNumbers];
            });
            
            if (!activePatterns.finalPrize || Object.keys(activePatterns.finalPrize).length === 0) {
                setGameState('finished');
            } else if (prev.length === 0) { // First winner of this stage
                setGameStage('final_prize');
                toast({
                  title: `🏆 ¡${prizeNames.first_prize} Reclamado!`,
                  description: `El juego continúa para el ¡${prizeNames.final_prize}!`,
                  duration: 4000
                });
            }
            return newWinners;
        });
    }

    if (gameStage === 'final_prize') {
        const isAlreadyWinner = winningCards.some(wc => wc.player.id === player.id);
        if(isAlreadyWinner) return;

        const prize = finalPrizePool;
        announceWinner(player, prize, prizeNames.final_prize);
        setWinningCards(prev => [...prev, { player, card, pattern: bingoResult.pattern, cardId: card.id, patternName: bingoResult.patternName }]);
        
        setWinningNumbers(currentWinningNumbers => {
            const cardNumbers = card.numbers;
            const patternNumbers = bingoResult.pattern.map(i => cardNumbers[i]).filter(n => typeof n === 'number');
            const uniqueNewNumbers = patternNumbers.filter(n => !currentWinningNumbers.includes(n));
            return [...currentWinningNumbers, ...uniqueNewNumbers];
        });

        setGameState('finished');
    }
  }, [
    gameState, gameStage, activePatterns, firstPrizeWinners, firstPrizePool, 
    announceWinner, setGameStage, setGameState, setFirstPrizeWinners,
    winningCards, finalPrizePool, setWinningCards, setWinningNumbers, bingoType
  ]);

  const markNumberOnCard = useCallback((playerId, cardId, numberIndex) => {
    setPlayers(prevPlayers => {
        const playerIndex = prevPlayers.findIndex(p => p.id === playerId);
        if (playerIndex === -1) return prevPlayers;

        const playerToUpdate = { ...prevPlayers[playerIndex] };
        const cardIndex = playerToUpdate.cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1 || playerToUpdate.cards[cardIndex].marked[numberIndex]) return prevPlayers;

        const newMarked = [...playerToUpdate.cards[cardIndex].marked];
        newMarked[numberIndex] = true;
        
        const updatedCard = { ...playerToUpdate.cards[cardIndex], marked: newMarked };

        checkForBingo(playerToUpdate, updatedCard);
        
        const updatedCards = [...playerToUpdate.cards];
        updatedCards[cardIndex] = updatedCard;
        
        const newPlayers = [...prevPlayers];
        newPlayers[playerIndex] = { ...playerToUpdate, cards: updateAndSortCards(updatedCards) };
        
        return newPlayers;
    });

    if (currentPlayer && currentPlayer.id === playerId) {
      setPlayerCards(prevCards => {
        const cardIndex = prevCards.findIndex(c => c.id === cardId);
        if (cardIndex === -1 || prevCards[cardIndex].marked[numberIndex]) return prevCards;

        const newMarked = [...prevCards[cardIndex].marked];
        newMarked[numberIndex] = true;
        const updatedCard = { ...prevCards[cardIndex], marked: newMarked };
        
        const newCards = [...prevCards];
        newCards[cardIndex] = updatedCard;

        return updateAndSortCards(newCards);
      });
    }
  }, [setPlayers, checkForBingo, updateAndSortCards, currentPlayer, setPlayerCards]);

  const drawNumber = useCallback(() => {
    setAvailableNumbers(prevAvailable => {
      if (prevAvailable.length === 0) {
        setGameState('finished');
        toast({ title: "Se acabaron las bolas", description: "El juego ha terminado.", variant: "destructive" });
        return prevAvailable;
      }
  
      const randomIndex = Math.floor(Math.random() * prevAvailable.length);
      const numberDrawn = prevAvailable[randomIndex];
      
      const newAvailable = prevAvailable.filter(num => num !== numberDrawn);
      
      setDrawnNumbers(prevDrawn => [...prevDrawn, numberDrawn]);
      setCurrentNumber(numberDrawn);
  
      players.forEach(player => {
        if (!player.cards) return;
        player.cards.forEach(card => {
          const numberIndex = card.numbers.indexOf(numberDrawn);
          if (numberIndex !== -1 && !card.marked[numberIndex]) {
            markNumberOnCard(player.id, card.id, numberIndex);
          }
        });
      });

      return newAvailable;
    });

  }, [players, markNumberOnCard, setAvailableNumbers, setDrawnNumbers, setCurrentNumber, setGameState]);

  const handleManualMark = useCallback((cardId, numberIndex) => {
    if(!currentPlayer || bingoType === '90' || gameMode === 'easy' || gameState !== 'playing') return;

    const player = players.find(p => p.id === currentPlayer.id);
    const card = player?.cards.find(c => c.id === cardId);

    if (!card || !drawnNumbers.includes(card.numbers[numberIndex]) || card.marked[numberIndex]) {
      toast({
        title: "¡Marca inválida!",
        description: "Solo puedes marcar números que ya han sido sacados.",
        variant: "destructive",
      });
      return;
    }
    
    markNumberOnCard(currentPlayer.id, cardId, numberIndex);
  }, [players, drawnNumbers, markNumberOnCard, currentPlayer, bingoType, gameMode, gameState]);

  return {
    drawNumber,
    handleManualMark,
    updateAndSortCards,
  };
};
