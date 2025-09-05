import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '@/context_old/BingoContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Star, PlusCircle, Edit, Trash2, Play, RefreshCw, XCircle, Trophy, Wand2 } from 'lucide-react';
import { generateBingoCard75, generateEmptyBingoCard75, checkBingo, DEFAULT_BINGO_PATTERNS_75, getColumnGradient } from '@/lib/bingoUtils';
import CardEditorModal from './CardEditorModal';

const SimulationPanel = ({ drawnNumbers, onStop, onReset, isFinished }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-zinc-900/80 backdrop-blur-sm p-4 rounded-xl border border-sky-500/30 mb-6"
    >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-sky-300 flex items-center gap-2"><Play /> Simulación en Curso</h2>
            {isFinished ? (
                 <Button onClick={onReset} size="sm" variant="outline" className="bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/50 text-sky-300">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Nueva Simulación
                </Button>
            ) : (
                <Button onClick={onStop} size="sm" variant="destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    Detener
                </Button>
            )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-h-28 overflow-y-auto p-2 bg-black/20 rounded-lg">
            {drawnNumbers.map((num, i) => (
                <motion.div 
                    key={num}
                    initial={{ scale: 0, opacity: 0}}
                    animate={{ scale: 1, opacity: 1}}
                    transition={{ delay: i * 0.05 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm text-white ${getColumnGradient(num)}`}
                >
                    {num}
                </motion.div>
            ))}
        </div>
    </motion.div>
);


const FavoriteCardDisplay = ({ card, onEdit, onDelete, simulationProps }) => {
  const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
  const { isSimulating, drawnNumbers, winnerCards, getCardStats } = simulationProps || {};
  
  const stats = isSimulating ? getCardStats(card) : null;
  const isWinner = isSimulating && winnerCards.some(winner => winner.card.id === card.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`bg-zinc-800/50 p-4 rounded-lg border transition-all duration-300 ${isWinner ? 'border-amber-400 shadow-lg shadow-amber-500/20' : 'border-zinc-700'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-bold text-lg flex items-center gap-2 ${isWinner ? 'text-amber-300' : 'text-amber-400'}`}>
          <Star className="w-5 h-5" />
          {card.name}
        </h3>
        {!isSimulating && (
            <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => onEdit(card)}>
                <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-rose-400 hover:text-rose-500" onClick={() => onDelete(card.id)}>
                <Trash2 className="w-4 h-4" />
            </Button>
            </div>
        )}
      </div>
      <div className="grid grid-cols-5 gap-1 text-center">
        {bingoLetters.map(letter => <div key={letter} className="font-bold text-zinc-400">{letter}</div>)}
        {card.numbers.map((number, index) => {
            const isMarked = isSimulating && number !== 'FREE' && drawnNumbers.includes(number);
            return (
                <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                    index === 12 ? 'bg-amber-500/20 text-amber-300' : 
                    isMarked ? 'bg-sky-400/80 text-white' : 'bg-zinc-700/50 text-white'
                    }`}
                >
                    {number === 'FREE' ? '★' : number}
                </div>
            )
        })}
      </div>
       {isWinner && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.5}}
            animate={{ opacity: 1, scale: 1}}
            className="mt-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-center py-1 rounded-md flex items-center justify-center gap-2"
        >
            <Trophy className="w-5 h-5"/> ¡Ganador!
        </motion.div>
      )}
      {isSimulating && stats && !isWinner && (
        <div className="mt-3 text-center text-xs text-zinc-400 bg-zinc-900/50 py-1 rounded-md">
            Acertados: {stats.markedCount} | Faltantes: {stats.numbersToWin}
        </div>
      )}
    </motion.div>
  );
};

function FavoriteCardsManager() {
  const { currentPlayer, bingoType, saveFavoriteCard, deleteFavoriteCard } = useBingo();
  const [editingCard, setEditingCard] = useState(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationDrawnNumbers, setSimulationDrawnNumbers] = useState([]);
  const [simulationWinnerCards, setSimulationWinnerCards] = useState([]);
  const [isSimulationFinished, setIsSimulationFinished] = useState(false);
  const simulationIntervalRef = React.useRef(null);
  
  const favoriteCards = currentPlayer?.favoriteCards?.filter(c => c.type === bingoType) || [];

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    setIsSimulationFinished(false);
    setSimulationDrawnNumbers([]);
    setSimulationWinnerCards([]);
    if(simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
  }, []);

  const startSimulation = useCallback(() => {
    if (favoriteCards.length === 0) {
      toast({ title: "No hay cartones", description: "Crea o guarda un cartón favorito para simular."});
      return;
    }
    stopSimulation();
    setIsSimulating(true);
    setIsSimulationFinished(false);

    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    const shuffledNumbers = allNumbers.sort(() => Math.random() - 0.5);
    let drawnCount = 0;
    
    simulationIntervalRef.current = setInterval(() => {
        if(drawnCount >= 75) {
             clearInterval(simulationIntervalRef.current);
             setIsSimulationFinished(true);
             return;
        }
        
        drawnCount++;
        const currentDrawn = shuffledNumbers.slice(0, drawnCount);
        setSimulationDrawnNumbers(currentDrawn);

        let winnersFound = [];
        for (const card of favoriteCards) {
            const cardForCheck = {
                ...card,
                marked: card.numbers.map(num => num === 'FREE' || currentDrawn.includes(num))
            };
            const result = checkBingo(cardForCheck, DEFAULT_BINGO_PATTERNS_75, '75');
            if (result.isBingo) {
                winnersFound.push({ card, result });
            }
        }

        if (winnersFound.length > 0) {
            setSimulationWinnerCards(winnersFound);
            clearInterval(simulationIntervalRef.current);
            setIsSimulationFinished(true);
        }

    }, 100);

  }, [favoriteCards, stopSimulation]);
  
  useEffect(() => {
    return () => clearInterval(simulationIntervalRef.current);
  }, []);

  const getCardStatsInSim = (card) => {
    const marked = card.numbers.map(num => num === 'FREE' || simulationDrawnNumbers.includes(num));
    const markedCount = marked.filter(Boolean).length;
    let numbersToWin = Infinity;
    Object.values(DEFAULT_BINGO_PATTERNS_75).forEach(pattern => {
        const markedInPattern = pattern.filter(index => marked[index]).length;
        const needed = pattern.length - markedInPattern;
        if (needed < numbersToWin) {
            numbersToWin = needed;
        }
    });
    return { markedCount, numbersToWin };
  };

  const handleCreateNew = () => {
    const newCard = generateEmptyBingoCard75();
    setEditingCard({
      id: `fav-${Date.now()}`,
      name: '',
      numbers: newCard.numbers,
      type: bingoType,
      isNew: true,
    });
  };

  const handleAddAutomatic = () => {
    const autoCard = generateBingoCard75();
    
    // Find the highest number for "Automático" cards
    const autoCardNumbers = favoriteCards
        .filter(c => c.name.startsWith("Automático #"))
        .map(c => parseInt(c.name.replace("Automático #", ""), 10))
        .filter(n => !isNaN(n));
    const nextAutoNumber = autoCardNumbers.length > 0 ? Math.max(...autoCardNumbers) + 1 : 1;
    
    const newFavorite = {
        id: autoCard.id,
        name: `Automático #${nextAutoNumber}`,
        numbers: autoCard.numbers,
        type: bingoType,
    };
    saveFavoriteCard(newFavorite);
    toast({
        title: "🪄 ¡Cartón Mágico Añadido!",
        description: `Se ha guardado "${newFavorite.name}" en tus favoritos.`
    });
  };

  const handleEdit = (card) => {
    setEditingCard(card);
  };

  const handleDelete = (cardId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cartón favorito?')) {
      deleteFavoriteCard(cardId);
      toast({ title: 'Cartón eliminado', description: 'Tu cartón favorito ha sido eliminado.' });
    }
  };

  const handleSave = (cardData) => {
    saveFavoriteCard(cardData);
    toast({
      title: '¡Guardado!',
      description: `El cartón "${cardData.name}" ha sido guardado en tus favoritos.`,
    });
    setEditingCard(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
          Mis Cartones Favoritos
        </h1>
        <div className="flex flex-wrap gap-2">
            {bingoType === '75' && !isSimulating && (
                 <Button onClick={startSimulation} variant="outline" className="bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20 hover:text-sky-200">
                    <Play className="w-5 h-5 mr-2" />
                    Simular
                </Button>
            )}
            {bingoType === '75' && (
            <Button onClick={handleAddAutomatic} disabled={isSimulating} variant="outline" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/20 hover:text-fuchsia-200">
                <Wand2 className="w-5 h-5 mr-2" />
                Añadir Automático
            </Button>
            )}
            {bingoType === '75' && (
            <Button onClick={handleCreateNew} disabled={isSimulating}>
                <PlusCircle className="w-5 h-5 mr-2" />
                Crear Nuevo
            </Button>
            )}
        </div>
      </div>

      {isSimulating && (
        <SimulationPanel 
            drawnNumbers={simulationDrawnNumbers}
            onStop={stopSimulation}
            onReset={startSimulation}
            isFinished={isSimulationFinished}
        />
      )}

      {bingoType !== '75' && (
         <div className="text-center py-16 text-zinc-400 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-700">
            <h3 className="text-2xl font-bold">Función no disponible</h3>
            <p>La gestión de cartones favoritos solo está disponible para el modo de Bingo de 75 bolas.</p>
        </div>
      )}

      {bingoType === '75' && (
        <>
          {favoriteCards.length === 0 && !isSimulating ? (
            <div className="text-center py-16 text-zinc-400 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-700">
              <h3 className="text-2xl font-bold">Aún no tienes cartones favoritos</h3>
              <p className="mt-2">¡Crea uno nuevo o guarda uno desde el juego para empezar!</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {favoriteCards.map(card => (
                  <FavoriteCardDisplay
                    key={card.id}
                    card={card}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    simulationProps={{
                      isSimulating,
                      drawnNumbers: simulationDrawnNumbers,
                      winnerCards: simulationWinnerCards,
                      getCardStats: getCardStatsInSim,
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      <AnimatePresence>
        {editingCard && (
          <CardEditorModal
            favoriteCardData={editingCard}
            onSaveFavorite={handleSave}
            onClose={() => setEditingCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FavoriteCardsManager;