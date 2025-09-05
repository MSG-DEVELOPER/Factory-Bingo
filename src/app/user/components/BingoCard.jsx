

"use client"
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import { getColumnPastelColor, getMarkedColumnBg, getColumnGradient } from '../lib/bingoUtils';
import { Edit, Star, Trash2, Shuffle, Target, Check } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const BingoCard75 = ({ card, handleNumberClick, attentionNumber, setMarkedEffect, markedEffect, isWinner, winningInfo, gameState, gameMode, setEditingCard }) => {
  const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
  const { drawnNumbers } = useBingo();

  return (
    <>
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-white">Cartón #{card.originalIndex + 1}</h3>
        <div className="flex justify-center items-center gap-2 mt-1">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.type === 'auto' ? 'bg-sky-500/20 text-sky-300' : 'bg-fuchsia-500/20 text-fuchsia-300'}`}>
            {card.type === 'auto' ? 'Automático' : 'Manual'}
          </span>
          {gameState === 'playing' && card.numbersToWin > 0 && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Faltan {card.numbersToWin}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
        {bingoLetters.map((letter, index) => (
          <div key={letter} className={`flex items-center justify-center text-xl sm:text-2xl font-black ${getColumnPastelColor((index * 15) + 1)}`}>
            {letter}
          </div>
        ))}
        {card.numbers.map((number, index) => {
          const isMarked = card.marked[index];
          const canBeMarked = drawnNumbers.includes(number);
          const needsAttention = attentionNumber === number && !isMarked;
          const isWinningNumber = isWinner && winningInfo.pattern.includes(index);

          return (
            <motion.div
              key={index}
              onClick={() => handleNumberClick(number, index)}
              animate={needsAttention ? {
                scale: [1, 1.2, 1],
                rotate: [0, 4, -4, 0],
              } : { scale: 1, rotate: 0 }}
              transition={needsAttention ? { 
                duration: 0.6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              } : { duration: 0.3 }}
              className={`
                relative aspect-square rounded-full flex items-center justify-center text-lg sm:text-xl font-bold
                transition-all duration-300
                ${(gameState === 'playing' && canBeMarked && !isMarked && gameMode !== 'easy') ? 'cursor-pointer hover:bg-zinc-700' : 'cursor-default'}
                ${isMarked
                  ? isWinningNumber
                    ? `ring-4 ring-amber-400 ${getColumnGradient(number)} text-white shadow-lg`
                    : `${getMarkedColumnBg(number)} text-white shadow-inner`
                  : 'bg-zinc-800 text-zinc-300'
                }
                ${needsAttention ? 'border-2 border-dashed border-amber-400' : 'border-transparent'}
              `}
            >
              {needsAttention && (
                <motion.div
                  className={`absolute inset-0 rounded-full ${getColumnGradient(number)} opacity-70`}
                  animate={{ scale: [1, 1.15], opacity: [0.7, 0.3, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <span className="relative z-10">
                {number === 'FREE' ? <Star className="w-5 h-5 text-amber-400" fill="currentColor" /> : number}
              </span>
              {markedEffect && markedEffect.index === index && (
                <motion.div
                  key={markedEffect.id}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                  onAnimationComplete={() => setMarkedEffect(null)}
                >
                  <Star className="text-amber-400 w-8 h-8" fill="currentColor" />
                </motion.div>
              )}
              {isWinningNumber && (
                <motion.div
                  className="absolute top-0 right-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Check className="w-5 h-5 text-zinc-950" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

const BingoCard90 = ({ card, handleNumberClick, attentionNumber, setMarkedEffect, markedEffect, isWinner, winningInfo, gameState, gameMode }) => {
  const { drawnNumbers } = useBingo();

  return (
    <>
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-white">Cartón #{card.originalIndex + 1}</h3>
        <div className="flex justify-center items-center gap-2 mt-1">
          {gameState === 'playing' && card.numbersToWin > 0 && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Faltan {card.numbersToWin}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-9 gap-1">
        {Array.from({ length: 27 }).map((_, index) => {
          const number = card.numbers[index];
          if (number === null) {
            return <div key={index} className="w-full aspect-square bg-zinc-800 rounded-md"></div>;
          }

          const isMarked = card.marked[index];
          const canBeMarked = drawnNumbers.includes(number);
          const needsAttention = attentionNumber === number && !isMarked;
          const isWinningNumber = isWinner && winningInfo.pattern.includes(index);

          return (
            <motion.div
              key={index}
              onClick={() => handleNumberClick(number, index)}
              animate={needsAttention ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={needsAttention ? { duration: 0.5, repeat: Infinity } : {}}
              className={`
                relative w-full aspect-square rounded-md flex items-center justify-center font-bold text-sm sm:text-lg
                transition-all duration-300
                ${(gameState === 'playing' && canBeMarked && !isMarked && gameMode !== 'easy') ? 'cursor-pointer hover:bg-zinc-700' : 'cursor-default'}
                ${isMarked
                  ? isWinningNumber
                    ? `ring-2 sm:ring-4 ring-amber-400 ${getColumnGradient(number, 90)} text-white shadow-lg`
                    : `${getMarkedColumnBg(number, 90)} text-white shadow-inner`
                  : 'bg-zinc-950 text-zinc-300'
                }
              `}
            >
              <span className="relative z-10">{number}</span>
               {markedEffect && markedEffect.index === index && (
                <motion.div
                  key={markedEffect.id}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                  onAnimationComplete={() => setMarkedEffect(null)}
                >
                  <Star className="text-amber-400 w-6 h-6" fill="currentColor" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};


function BingoCard({ card, cardIndex }) {
  const { bingoType, currentNumber, handleMarkNumber, gameState, winningCards, drawnNumbers, setEditingCard, removeCard, regenerateCard, gameMode, saveFavoriteCard } = useBingo();
  const [attentionNumber, setAttentionNumber] = useState(null);
  const [markedEffect, setMarkedEffect] = useState(null);

  const winningInfo = winningCards.find(wc => wc.cardId === card.id);
  const isWinner = !!winningInfo;

  useEffect(() => {
    if (currentNumber && card.numbers.includes(currentNumber)) {
      const numberIndex = card.numbers.indexOf(currentNumber);
      if (!card.marked[numberIndex]) {
        setAttentionNumber(currentNumber);
      }
    }
  }, [currentNumber, card.numbers, card.marked]);

  useEffect(() => {
    if (attentionNumber && card.marked[card.numbers.indexOf(attentionNumber)]) {
      setAttentionNumber(null);
    }
  }, [card.marked, attentionNumber, card.numbers]);

  const handleNumberClick = (number, numberIndex) => {
    if (number === null || gameState !== 'playing' || card.marked[numberIndex] || number === 'FREE' || !drawnNumbers.includes(number) || gameMode === 'easy') {
      return;
    }
    handleMarkNumber(card.id, numberIndex);
    setMarkedEffect({ index: numberIndex, id: Math.random() });
    if (number === attentionNumber) {
      setAttentionNumber(null);
    }
  };

  const handleSaveFavorite = () => {
    const cardName = prompt("Dale un nombre a tu cartón favorito:", `Mi Cartón ${Math.floor(Math.random() * 100)}`);
    if (cardName) {
      const newFavoriteCard = {
        id: `fav-${Date.now()}`,
        name: cardName,
        numbers: card.numbers,
        type: bingoType,
      };
      saveFavoriteCard(newFavoriteCard);
      toast({
        title: "¡Cartón Guardado!",
        description: `"${cardName}" ha sido añadido a tus favoritos.`,
      });
    }
  };

  const isBingo75 = bingoType === '75';

  return (
    <motion.div
      layoutId={`bingo-card-${card.id}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`bg-zinc-900/50 rounded-xl shadow-lg p-2 sm:p-4 border transition-all duration-500 relative ${isWinner ? 'border-amber-400 shadow-amber-400/30' : 'border-zinc-700'}`}
    >
      {gameState === 'setup' && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          {isBingo75 && (
            <button
              onClick={handleSaveFavorite}
              className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors shadow-md"
              title="Guardar como Favorito"
            >
              <Star className="w-4 h-4" />
            </button>
          )}
          {isBingo75 && (
            <button
              onClick={() => setEditingCard(card)}
              className="bg-violet-500 text-white p-2 rounded-full hover:bg-violet-600 transition-colors shadow-md"
              title="Editar Cartón"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => regenerateCard(card.id)}
            className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors shadow-md"
            title="Generar Nuevo Cartón"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={() => removeCard(card.id)}
            className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-md"
            title="Eliminar Cartón"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {isBingo75 ? (
        <BingoCard75 
          card={card}
          handleNumberClick={handleNumberClick}
          attentionNumber={attentionNumber}
          setMarkedEffect={setMarkedEffect}
          markedEffect={markedEffect}
          isWinner={isWinner}
          winningInfo={winningInfo}
          gameState={gameState}
          gameMode={gameMode}
          setEditingCard={setEditingCard}
        />
      ) : (
        <BingoCard90 
          card={card}
          handleNumberClick={handleNumberClick}
          attentionNumber={attentionNumber}
          setMarkedEffect={setMarkedEffect}
          markedEffect={markedEffect}
          isWinner={isWinner}
          winningInfo={winningInfo}
          gameState={gameState}
          gameMode={gameMode}
        />
      )}

      {isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 bg-gradient-to-r from-amber-300 to-orange-400 text-zinc-950 text-center py-2 rounded-lg font-bold text-lg shadow-lg"
        >
          🏆 ¡BINGO! 🏆
        </motion.div>
      )}
    </motion.div>
  );
}

export default BingoCard;
