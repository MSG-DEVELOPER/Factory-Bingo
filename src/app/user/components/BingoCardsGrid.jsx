
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBingo } from '../context/BingoContext';
import BingoCard from './BingoCard';
import { Button } from '../components/ui/button';
import { PlusCircle, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

function FavoriteCardsPopover({ onSelect }) {
  const { currentPlayer, bingoType } = useBingo();
  const favoriteCards = currentPlayer?.favoriteCards?.filter(c => c.type === bingoType) || [];

  if (favoriteCards.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-zinc-400">
        No tienes cartones favoritos para este modo de juego. ¡Guarda algunos!
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
      {favoriteCards.map(favCard => (
        <Button
          key={favCard.id}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect(favCard)}
        >
          <Star className="w-4 h-4 mr-2 text-amber-400" />
          {favCard.name}
        </Button>
      ))}
    </div>
  );
}

function BingoCardsGrid() {
  const { playerCards, gameState, bingoType, addCard, addFavoriteCardToGame } = useBingo();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSelectFavorite = (favCard) => {
    addFavoriteCardToGame(favCard.id);
    setPopoverOpen(false);
  };

  const showInitialButtons = (gameState === 'setup' || gameState === 'countdown') && playerCards.length === 0;

  if (showInitialButtons) {
    return (
      <div className="text-center py-16 text-zinc-400 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-700">
        <h3 className="text-2xl font-bold mb-4">¡Añade tus cartones!</h3>
        <p className="mb-6">Usa los botones para añadir cartones para el Bingo de {bingoType} bolas.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => addCard()} size="lg">
            <PlusCircle className="w-5 h-5 mr-2" />
            Añadir Cartón Aleatorio
          </Button>
          {bingoType === '75' && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="lg">
                  <Star className="w-5 h-5 mr-2" />
                  Añadir desde Favoritos
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-zinc-800 border-zinc-700 text-white">
                <FavoriteCardsPopover onSelect={handleSelectFavorite} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    );
  }

  const gridClasses = bingoType === '75' 
    ? "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3" 
    : "grid-cols-1 xl:grid-cols-2";

  return (
    <motion.div
      layout
      className={`grid ${gridClasses} gap-4 sm:gap-6`}
    >
      <AnimatePresence>
        {playerCards.map((card, cardIndex) => (
          <BingoCard key={card.id} card={card} cardIndex={card.originalIndex} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default BingoCardsGrid;
